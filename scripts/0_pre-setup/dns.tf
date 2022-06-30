# DNS Setup for hosted zone (e.g. flox.polygon-project.ch)

resource "aws_route53_zone" "zone" {
  name    = var.base_domain
}
