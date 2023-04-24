variable "tf_api_token" {
  description = "Terraform API token"
  type        = string
}

variable "type" {
  description = "live, test or dev"
  type        = string
}

variable "domain" {
  description = "Project base domain, e.g. flox.polygon-project.ch"
  type        = string
}


variable "aws_access_key" {
  description = "aws_access_key_id"
  type        = string
}

variable "aws_secret_access_key" {
  description = "aws_secret_access_key"
  type        = string
}

variable "aws_region" {
  default     = "eu-central-1" // Frankfurt (Germany)
  description = "AWS Region"
  type        = string
}

variable "project" {
  description = "prefix used for all resources in the Project"
  type        = string
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
}
