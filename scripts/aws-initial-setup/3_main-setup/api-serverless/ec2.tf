// Most recent Amazon Linux 2 Image
data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm*"]
  }
}

// EC2 instance for SSH access via AWS SSM (for connecting to RDS database)
resource "aws_instance" "ec2_ssh_instance" {
  ami           = data.aws_ami.amazon_linux_2.id
  instance_type = "t2.nano"
  vpc_security_group_ids = [
    var.api_security_group_id, // API security group
    var.database_ec2_to_rds_security_group_id // Egress security group
  ]

  iam_instance_profile = aws_iam_instance_profile.ec2_ssm_profile.name
  subnet_id = var.private_subnet_ids[0]
  tags = {
    Name = "${var.project}-${var.type}-ec2-ssh-instance"
  }
}
