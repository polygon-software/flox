variable "project" {
  default         = "flox"
  description     = "prefix used for all resources in the Project"
  type            = string
}

variable "domain_manager_aws_secret_access_key" {
  description     = "Secret access key of domain manager in parent organisation"
  type            = string
}

variable "domain_manager_aws_access_key" {
  description     = "access key of domain manager in parent organisation"
  type            = string
}

variable "base_domain" {
  description = "Base URL for project pages, e.g. polygon-project.ch"
  type            = string
}

variable "hosted_zone_id" {
  description = "Base URL hosted zone ID"
  type            = string
}

variable "ns_records" {
  description = "Nameserver records for customer hosted zone"
  type            = list(string)
}
