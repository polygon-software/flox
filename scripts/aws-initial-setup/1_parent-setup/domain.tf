resource "aws_route53_record" "api_record" {
  name                  = "${var.type}.${var.project}.${var.root_domain}"
  type                  = "NS"
  zone_id               = var.root_hosted_zone_id
  ttl                   = 172800
  records               = var.ns_records
}
