// RDS Database setup
resource "aws_db_subnet_group" "database_subnet_group" {
  name                      = "${var.project}-${var.type}-database-subnet-group"
  subnet_ids                = aws_subnet.database_subnets.*.id
  tags = {
    Name          = "Database Subnet Group"
  }
}

resource "aws_subnet" "database_subnets" {
  count                     = 3
  cidr_block                = cidrsubnet(var.cidr_block, 5, count.index + 3)
  vpc_id                    = aws_vpc.vpc.id
  availability_zone         = var.azs[count.index]
  tags = {
    Name          = "Database Subnet ${var.azs[count.index]}"
  }
}

/**
  ====================
  Serverless mode only
  ====================
**/

// Security group for DB access in serverless mode (egress; EC2 to RDS)
resource "aws_security_group" "database_ec2_to_rds_security_group" {
  depends_on = [aws_security_group.database_rds_to_ec2_security_group]
  count = var.serverless_api == true ? 1 : 0
  name                      = "${var.project}-${var.type}-rds-ec2-egress-security-group"
  vpc_id                    = aws_vpc.vpc.id
  tags = {
    Project       = var.project
  }
  egress {
    from_port           = 5432
    to_port             = 5432
    protocol            = "TCP"
    security_groups     = [aws_security_group.database_rds_to_ec2_security_group[0].id] // Allow to ingress group
  }
}

// Security group for DB access (ingress; RDS to EC2), must be attached to instances in RDS cluster
resource "aws_security_group" "database_rds_to_ec2_security_group" {
  count = var.serverless_api == true ? 1 : 0
  name                      = "${var.project}-${var.type}-rds-ec2-ingress-security-group"
  vpc_id                    = aws_vpc.vpc.id
  tags = {
    Project       = var.project
  }
}

// Rule for RDS -> EC2 security group must be added later to prevent cyclic dependency between the two groups
resource "aws_security_group_rule" "rds_to_ec2_rule" {
  count = var.serverless_api == true ? 1 : 0
  depends_on = [
    aws_security_group.database_ec2_to_rds_security_group,
    aws_security_group.database_rds_to_ec2_security_group
  ]
  security_group_id = aws_security_group.database_rds_to_ec2_security_group[0].id
  type = "ingress"
  from_port           = 5432
  to_port             = 5432
  protocol            = "TCP"
  source_security_group_id     = aws_security_group.database_ec2_to_rds_security_group[0].id // Allow to egress (EC2->RDS) group
}

// Actual database cluster
resource "aws_rds_cluster" "database_cluster" {
  engine                    = "aurora-postgresql"
  /**
    Not all versions are supported by serverless v1! To get currently supported versions:
    aws rds describe-db-engine-versions |
      jq -r '.DBEngineVersions[] |
      select(.SupportedEngineModes[]?=="serverless") |
      "\(.Engine): \(.EngineVersion)"'
  **/
  engine_version            = var.serverless_db == true && var.serverless_db_version == "v1" ? "10.21" : "13.6"
  cluster_identifier        = "${var.project}-${var.type}-database-cluster"
  database_name             = var.database_name
  master_username           = var.database_master_username
  master_password           = var.database_master_password
  skip_final_snapshot       = var.type == "live" ? false : true
  db_subnet_group_name      = aws_db_subnet_group.database_subnet_group.name
  vpc_security_group_ids    = var.serverless_api ? [
    aws_security_group.database_security_group.id,
    aws_security_group.database_rds_to_ec2_security_group[0].id,
  ] : [aws_security_group.database_security_group.id]
  kms_key_id                = aws_kms_key.rds_encryption_key.arn
  storage_encrypted         = true
  backup_retention_period   = 30
  deletion_protection       = var.type == "live" ? true : false
  // Serverless v1 is non-provisioned
  engine_mode = var.serverless_db == true && var.serverless_db_version == "v1" ? "serverless" : "provisioned"

  // Serverless v1 scaling configuration
  dynamic scaling_configuration {
    for_each = var.serverless_db == true && var.serverless_db_version == "v1" ? [1] : []
    content {
      auto_pause               = true
      max_capacity             = 4 // TODO application specific: Change scaling factor
      min_capacity             = 2 // 2 is the minimum for PostgreSQL with v1
      seconds_until_auto_pause = 300
      timeout_action           = "ForceApplyCapacityChange"
    }
  }

  // Serverless v2 scaling configuration
  dynamic "serverlessv2_scaling_configuration" {
    for_each = var.serverless_db == true && var.serverless_db_version == "v2" ? [1] : []
    content {
      max_capacity = 2.0 // TODO application specific: Change scaling factor
      min_capacity = 0.5 // 0.5 is the minimum for PostgreSQL with v2
    }
  }

  lifecycle {
    prevent_destroy = false
  }
}

// Cluster instances (only in non-serverless-v1 mode)
resource "aws_rds_cluster_instance" "database_cluster_instances" {
  identifier                = "${var.project}-${var.type}-rds-${count.index}"
  engine                    = "aurora-postgresql"
  engine_version            = "13.6"
  cluster_identifier        = aws_rds_cluster.database_cluster.id
  instance_class            = var.serverless_db == true ? "db.serverless" : "db.t4g.medium"
  db_subnet_group_name      = aws_db_subnet_group.database_subnet_group.name
  count                     = var.serverless_db == true && var.serverless_db_version == "v1"  ? 0 : 2
  tags = {
    Project       = var.project
  }
}

resource "aws_security_group" "database_security_group" {
  name                      = "${var.project}-${var.type}-database-security-group"
  vpc_id                    = aws_vpc.vpc.id
  tags = {
    Project       = var.project
  }
  ingress {
    from_port           = 5432
    to_port             = 5432
    protocol            = "TCP"
    security_groups     = [aws_security_group.api_security_group.id]
  }
  egress {
    from_port           = 0
    to_port             = 0
    protocol            = "-1"
    cidr_blocks         = ["0.0.0.0/0"]
    ipv6_cidr_blocks    = ["::/0"]
  }
}
