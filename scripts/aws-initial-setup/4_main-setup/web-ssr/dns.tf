resource "aws_acm_certificate" "frontend_cert" {
  domain_name = var.domain
  validation_method = "DNS"
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "ssl_frontend" {
  for_each = {
  for dvo in aws_acm_certificate.frontend_cert.domain_validation_options : dvo.domain_name => {
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

resource "aws_acm_certificate_validation" "cert_validation_frontend" {
  certificate_arn         = aws_acm_certificate.frontend_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.ssl_frontend : record.fqdn]
}

# Redirect for www. -> non-www
resource "aws_route53_record" "redirect_record" {
  name                  = "www.${var.domain}"
  type                  = "CNAME"
  zone_id               = var.hosted_zone_id
  ttl                   = "300"
  records               = [aws_elastic_beanstalk_environment.frontend_env.endpoint_url]
}

