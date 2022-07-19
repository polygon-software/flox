variable "domain" {
  description = "Project base domain, e.g. flox.polygon-project.ch"
  type    = string
}

variable "hosted_zone_id" {
  description     = "Route53 hosted zone ID"
  type            = string
}
