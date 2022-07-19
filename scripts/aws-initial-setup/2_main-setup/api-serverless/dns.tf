// API Gateway entry
resource "aws_api_gateway_domain_name" "api_domain" {
  certificate_arn = aws_acm_certificate.backend_cert.arn
  domain_name     = "api.${var.domain}"
}

// Route 53 A record pointing to API Gateway
resource "aws_route53_record" "api_record" {
  name                  = aws_api_gateway_domain_name.api_domain.domain_name
  type                  = "CNAME"
  zone_id               = var.hosted_zone_id
  alias {
    evaluate_target_health = false
    name                   = aws_lambda_function_url.api_lambda_url.function_url
    zone_id                = var.hosted_zone_id
  }
}

resource "aws_acm_certificate" "backend_cert" {
  domain_name = "api.${var.domain}"
  validation_method = "DNS"
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "ssl_backend" {
  for_each = {
  for dvo in aws_acm_certificate.backend_cert.domain_validation_options : dvo.domain_name => {
    name   = dvo.resource_record_name
    record = dvo.resource_record_value
    type   = dvo.resource_record_type
  }
  }
  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = var.hosted_zone_id
}

resource "aws_acm_certificate_validation" "cert_validation_backend" {
  certificate_arn         = aws_acm_certificate.backend_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.ssl_backend : record.fqdn]
}

resource "aws_security_group" "api_security_group" {
  name                  = "${var.project}-${var.type}-api-security-group"
  vpc_id                = aws_vpc.vpc.id

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
