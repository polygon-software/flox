# DNS Setup

resource "aws_acm_certificate" "frontend_cert" {
  domain_name = var.base_domain
  validation_method = "DNS"
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate" "backend_cert" {
  domain_name = "api.${var.base_domain}"
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

resource "aws_route53_record" "ssl_backend" {
  for_each = {
  for dvo in aws_acm_certificate.backend_cert.domain_validation_options : dvo.domain_name => {
    name   = dvo.resource_record_name
    record = dvo.resource_record_value
    type   = dvo.resource_record_type
  }
  }
  allow_overwrite = true
  name    = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = var.hosted_zone_id
}

resource "aws_route53_record" "api_record" {
  name                  = "api.${var.base_domain}"
  type                  = "CNAME"
  zone_id               = var.hosted_zone_id
  ttl                   = "300"
  records               = [aws_elastic_beanstalk_environment.api_env.endpoint_url]
}

resource "aws_acm_certificate_validation" "cert_validation_frontend" {
  certificate_arn         = aws_acm_certificate.frontend_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.ssl_frontend : record.fqdn]
}

resource "aws_acm_certificate_validation" "cert_validation_backend" {
  certificate_arn         = aws_acm_certificate.backend_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.ssl_backend : record.fqdn]
}

data "aws_elastic_beanstalk_hosted_zone" "hosted_zone" {}

resource "aws_route53_record" "web_record_alias" {
  name                  = var.base_domain
  type                  = "A"
  zone_id               = var.hosted_zone_id
  alias {
    evaluate_target_health = true
    name                   = var.frontend_build_mode == "ssr" ?module.web_ssr[0].frontend_env_cname : module.web_spa_pwa[0].cloudfront_url // TODO test
    zone_id                = data.aws_elastic_beanstalk_hosted_zone.hosted_zone.id
  }
}

resource "aws_route53_record" "web_record_alias_AAAA" {
  name                  = var.base_domain
  type                  = "AAAA"
  zone_id               = var.hosted_zone_id
  alias {
    evaluate_target_health = true
    name                   = var.frontend_build_mode == "ssr" ?module.web_ssr[0].frontend_env_cname : module.web_spa_pwa[0].cloudfront_url // TODO test
    zone_id                = data.aws_elastic_beanstalk_hosted_zone.hosted_zone.id
  }
}

# TODO: also automatically set up www.example.com -> example.com redirect
