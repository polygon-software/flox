# DNS Setup for hosted zone (e.g. flox.polygon-project.ch)

resource "aws_route53_zone" "zone" {
  name    = var.base_domain
}

output "ns_records" {
  description = "Nameserver records for customer hosted zone"
  value       = [
    aws_route53_zone.zone.name_servers[0],
    aws_route53_zone.zone.name_servers[1],
    aws_route53_zone.zone.name_servers[2],
    aws_route53_zone.zone.name_servers[3],
  ]
}
