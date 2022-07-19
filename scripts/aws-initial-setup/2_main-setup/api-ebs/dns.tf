resource "aws_route53_record" "api_record" {
  name                  = "api.${var.domain}"
  type                  = "CNAME"
  zone_id               = var.hosted_zone_id
  ttl                   = "300"
  records               = [aws_elastic_beanstalk_environment.api_env.endpoint_url]
}

resource "aws_security_group" "api_security_group" {
  name                  = "${var.project}-${var.type}-api-security-group"
  vpc_id                = var.vpc_id

  ingress {
    from_port         = 3000
    protocol          = "TCP"
    to_port           = 3000
    cidr_blocks       = ["0.0.0.0/0"]
    ipv6_cidr_blocks  = ["::/0"]
  }
  egress {
    from_port         = 0
    to_port           = 0
    protocol          = "-1"
    cidr_blocks       = ["0.0.0.0/0"]
    ipv6_cidr_blocks  = ["::/0"]
  }
}
