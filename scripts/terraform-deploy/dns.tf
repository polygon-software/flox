resource "aws_acm_certificate" "cert" {
  domain_name = "soi-${lookup(var.type, terraform.workspace)}.${var.superdomain}"
  validation_method = "DNS"
  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_route53_zone" "subdomain" {
  name = var.domain_name
}

resource "aws_route53_record" "ssl" {
  for_each = {
  for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
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
  zone_id         = aws_route53_zone.subdomain.zone_id
}

resource "aws_route53_record" "api_record" {
  name                  = "${var.api}.${var.domain_name}"
  type                  = "CNAME"
  zone_id               = aws_route53_zone.subdomain.id
  ttl                   = "300"
  records               = [aws_elastic_beanstalk_environment.api_env.endpoint_url]
}

resource "aws_acm_certificate_validation" "vali" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.ssl : record.fqdn]
}

resource "aws_route53_record" "web_record" {
  name                  = "${var.web}.${var.domain_name}"
  type                  = "CNAME"
  zone_id               = aws_route53_zone.subdomain.id
  ttl                   = "300"
  records               = [aws_elastic_beanstalk_environment.frontend_env.endpoint_url]
}
