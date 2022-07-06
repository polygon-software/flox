variable "project" {
  description = "Project name"
  type        = string
}

variable "type" {
  description = "Deploy type (live or test)"
  type        = string
}

variable "domain" {
  description = "Deployment domain (e.g. flox.polygon-project.ch)"
  type        = string
}

variable "hosted_zone_id" {
  description = "Domain hosted zone ID"
  type        = string
}


variable "ssl_certificate_arn" {
  description = "Frontend certificate ARN"
  type = string
}
