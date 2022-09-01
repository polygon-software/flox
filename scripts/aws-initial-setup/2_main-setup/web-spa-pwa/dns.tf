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

resource "aws_route53_record" "redirect_record" {
  depends_on = [
    aws_s3_bucket.redirect_bucket,
    aws_s3_bucket_website_configuration.redirect_bucket_config,
  ]
  name                  = "www.${var.domain}"
  type                  = "A"
  zone_id               = var.hosted_zone_id
  alias {
    evaluate_target_health = false
    name                   = aws_s3_bucket_website_configuration.redirect_bucket_config.website_domain
    zone_id                = aws_s3_bucket.redirect_bucket.hosted_zone_id
  }
}
