//VPN config to directly connect to the Database for devs


resource "aws_ec2_client_vpn_endpoint" "vpn" {
  description           = "VPN endpoint"
  client_cidr_block     = "10.20.0.0/22"
  split_tunnel          = true
  server_certificate_arn = "arn:aws:acm:eu-central-1:923473058470:certificate/465c3771-85a3-4572-81fa-cab80b45907b"

  authentication_options {
    type                        = "certificate-authentication"
    root_certificate_chain_arn  = "arn:aws:acm:eu-central-1:923473058470:certificate/bdf867a5-a169-4d67-a6e0-6cc52a0e55d8"
  }
  connection_log_options {
    enabled                     = false
  }
  tags = {
    Project       = var.project
    Type          = lookup(var.type, terraform.workspace)
  }
}

resource "aws_security_group" "vpn_access" {
  vpc_id                = aws_vpc.vpc.id
  name                  = "VPN access"
  tags = {
    Project       = var.project
  }
  ingress {
    from_port     = 443
    protocol      = "UDP"
    to_port       = 443
    cidr_blocks   = ["0.0.0.0/0"]
    description   = "Incoming VPN connection"
  }
  egress {
    from_port     = 0
    protocol      = "-1"
    to_port       = 0
    cidr_blocks   = ["0.0.0.0/0"]
  }
}

// Associate the VPN with the database subnets
resource "aws_ec2_client_vpn_network_association" "vpn_subnets" {
  count                   = 3
  client_vpn_endpoint_id  = aws_ec2_client_vpn_endpoint.vpn.id
  subnet_id               = aws_subnet.database_subnets[count.index].id
  security_groups         = [aws_security_group.vpn_access.id]
  lifecycle {
    ignore_changes  = [subnet_id]
  }
}

resource "aws_ec2_client_vpn_authorization_rule" "vpn_auth_rule" {
  client_vpn_endpoint_id  = aws_ec2_client_vpn_endpoint.vpn.id
  target_network_cidr     = aws_vpc.vpc.cidr_block
  authorize_all_groups    = true
}
