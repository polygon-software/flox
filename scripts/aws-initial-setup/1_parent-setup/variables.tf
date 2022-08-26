variable "tf_api_token" {
  description     = "Terraform API token"
  type            = string
}

variable "type" {
  description     = "live, test or dev"
  type            = string
}

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

variable "root_domain" {
  description     = "Base URL for project pages, e.g. polygon-project.ch"
  default         = "polygon-project.ch"
  type            = string
}

variable "root_hosted_zone_id" {
  description     = "Base URL hosted zone ID"
  type            = string
  default         = "Z095791315VP7D61MDYIL" # polygon-project.ch hosted zone
}

variable "ns_records" {
  description     = "Nameserver records for customer hosted zone"
  type            = list(string)
}

variable "aws_region" {
  default         = "eu-central-1"
  description     = "AWS Region"
  type            = string
}
