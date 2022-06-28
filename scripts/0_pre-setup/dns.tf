# DNS Setup for hosted zone (e.g. flox.polygon-project.ch)

resource "aws_route53_zone" "zone" {
  name    = var.base_domain
}

resource "aws_route53_record" "zone_ns_records" {
  allow_overwrite = true
  name            = var.base_domain
  ttl             = 172800
  type            = "NS"
  zone_id         = aws_route53_zone.zone.zone_id

  records = [
    aws_route53_zone.zone.name_servers[0],
    aws_route53_zone.zone.name_servers[1],
    aws_route53_zone.zone.name_servers[2],
    aws_route53_zone.zone.name_servers[3],
  ]
}

output "ns_records" {
  description = "Nameserver records for customer hosted zone"
  value       = aws_route53_record.zone_ns_records.records
}
