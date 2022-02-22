resource "aws_acm_certificate" "vpn_server" {
  private_key = file("/Users/johannschwabe/Documents/git/easy-rsa/easyrsa3/pki/private/server.key")
  certificate_body = file("/Users/johannschwabe/Documents/git/easy-rsa/easyrsa3/pki/issued/server.crt")
  certificate_chain = file("/Users/johannschwabe/Documents/git/easy-rsa/easyrsa3/pki/ca.crt")
  tags = {
    name = "server"
  }
}


resource "aws_acm_certificate" "vpn_client_root" {
  private_key = file("/Users/johannschwabe/Documents/git/easy-rsa/easyrsa3/pki/private/rdsserver.key")
  certificate_body = file("/Users/johannschwabe/Documents/git/easy-rsa/easyrsa3/pki/issued/rdsserver.crt")
  certificate_chain = file("/Users/johannschwabe/Documents/git/easy-rsa/easyrsa3/pki/ca.crt")
  tags = {
    name = "client"
  }
}

resource "aws_ec2_client_vpn_endpoint" "vpn" {
  description = "VPN endpoint"
  client_cidr_block = "10.20.0.0/22"
  split_tunnel = true
  server_certificate_arn = aws_acm_certificate.vpn_server.arn

  authentication_options {
    type = "certificate-authentication"
    root_certificate_chain_arn = aws_acm_certificate.vpn_client_root.arn
  }
  connection_log_options {
    enabled = false
  }
}

resource "aws_security_group" "vpn_access" {
  vpc_id = aws_vpc.tf_eb_vpc.id
  name = "VPN access"
  ingress {
    from_port = 443
    protocol  = "UDP"
    to_port   = 443
    cidr_blocks = ["0.0.0.0/0"]
    description = "Incoming VPN connection"
  }
  egress {
    from_port = 0
    protocol  = "-1"
    to_port   = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ec2_client_vpn_network_association" "vpn_subnets" {
  count = 3
  client_vpn_endpoint_id = aws_ec2_client_vpn_endpoint.vpn.id
  subnet_id              = aws_subnet.tf_db_subnet[count.index].id
  security_groups = [aws_security_group.vpn_access.id]
  lifecycle {
    ignore_changes = [subnet_id]
  }
}

resource "aws_ec2_client_vpn_authorization_rule" "vpn_auth_rule" {
  client_vpn_endpoint_id = aws_ec2_client_vpn_endpoint.vpn.id
  target_network_cidr    = aws_vpc.tf_eb_vpc.cidr_block
  authorize_all_groups = true
}
