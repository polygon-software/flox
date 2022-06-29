resource "aws_route53_record" "api_record" {
  name                  = "${var.project}.${var.root_domain}"
  type                  = "NS"
  zone_id               = var.hosted_zone_id
  ttl                   = 172800
  records               = var.ns_records
}
