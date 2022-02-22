resource "aws_db_subnet_group" "tf_db_subnet_group" {
  name = "${var.project_prefix_char}-db_subnet_group"
  subnet_ids = aws_subnet.tf_db_subnet.*.id
}

resource "aws_subnet" "tf_db_subnet" {
  count = 3
  cidr_block = cidrsubnet(var.cidr_block, 4, count.index + 3)
  vpc_id     = aws_vpc.tf_eb_vpc.id
  availability_zone = var.azs[count.index]
}


resource "aws_rds_cluster" "tf_db_cluster" {
  engine = "aurora-postgresql"
  engine_version = "12.7"
  cluster_identifier = "${var.project_prefix_char}-db-cluster"
  database_name = "soi_db"
  master_username = "db_user"
  master_password = "db_user_pass"
  skip_final_snapshot = true // todo use final snapshot in production
  db_subnet_group_name = aws_db_subnet_group.tf_db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.DB-Security-Group.id]
}

resource "aws_rds_cluster_instance" "tf_db_instance" {
  identifier = "${var.project_prefix_char}-rds-${count.index}"
  engine = "aurora-postgresql"
  engine_version = "12.7"
  cluster_identifier = aws_rds_cluster.tf_db_cluster.id
  instance_class     = "db.t3.medium"
  db_subnet_group_name = aws_db_subnet_group.tf_db_subnet_group.name
  count = 2
}


resource "aws_security_group" "DB-Security-Group" {
  name = "${var.project_prefix_char}-db-security-group"
  vpc_id = aws_vpc.tf_eb_vpc.id
  ingress {
    from_port = 5432
    to_port = 5432
    protocol = "TCP"
    security_groups = [aws_security_group.API-Security-Group.id, aws_security_group.vpn_access.id]
  }
  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}





