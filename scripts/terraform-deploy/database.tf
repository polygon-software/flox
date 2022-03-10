//RDS database stuff
resource "aws_db_subnet_group" "database_subnet_group" {
  name                      = "${var.project}-${var.type}-database-subnet-group"
  subnet_ids                = aws_subnet.database_subnets.*.id
  tags = {
    Project       = var.project
    Name          = "Database Subnet Group"
  }
}

resource "aws_subnet" "database_subnets" {
  count                     = 3
  cidr_block                = cidrsubnet(var.cidr_block, 4, count.index + 3)
  vpc_id                    = aws_vpc.vpc.id
  availability_zone         = var.azs[count.index]
  tags = {
    Project       = var.project
    Name          = "Database Subnet ${var.azs[count.index]}"
  }
}

resource "aws_rds_cluster" "database_cluster" {
  engine                    = "aurora-postgresql"
  engine_version            = "12.7"
  cluster_identifier        = "${var.project}-${var.type}-database-cluster"
  database_name             = var.database_name
  master_username           = var.database_master_username
  master_password           = var.database_master_password  // Mhm..
  skip_final_snapshot       = true // todo use final snapshot in production
  db_subnet_group_name      = aws_db_subnet_group.database_subnet_group.name
  vpc_security_group_ids    = [aws_security_group.database_security_group.id]
  tags = {
    Project       = var.project
  }
}

resource "aws_rds_cluster_instance" "database_cluster_instances" {
  identifier                = "${var.project}-${var.type}-rds-${count.index}"
  engine                    = "aurora-postgresql"
  engine_version            = "12.7"
  cluster_identifier        = aws_rds_cluster.database_cluster.id
  instance_class            = "db.t4g.medium"
  db_subnet_group_name      = aws_db_subnet_group.database_subnet_group.name
  count                     = 2
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
    security_groups     = [aws_security_group.api_security_group.id, aws_security_group.vpn_access.id]
  }
  egress {
    from_port           = 0
    to_port             = 0
    protocol            = "-1"
    cidr_blocks         = ["0.0.0.0/0"]
    ipv6_cidr_blocks    = ["::/0"]
  }
}





