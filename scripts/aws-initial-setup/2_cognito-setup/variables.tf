variable "tf_api_token" {
  description     = "Terraform API token"
  type            = string
}

variable "type" {
  description     = "live, test or dev"
  type            = string
}

variable "mfa_configuration" {
  default         = "ON" # Alternatives: 'OFF', 'OPTIONAL'
  description     = "Cognito MFA mode"
  type            = string
}

variable "auto_verified_attributes"{
  default         = ["email"]
  description     = "Cognito attributes to auto-verify"
  type            = set(string)
}

variable "username_attributes"{
  default         = ["email"]
  description     = "Cognito username attributes"
  type            = set(string)
}


variable "domain" {
  description = "Project base domain, e.g. flox.polygon-project.ch"
  type    = string
}


variable "aws_access_key" {
  description     = "aws_access_key_id"
  type            = string
}

variable "aws_secret_access_key" {
  description     = "aws_secret_access_key"
  type            = string
}

variable "aws_region" {
  default         = "eu-central-1"
  description     = "AWS Region"
  type            = string
}

variable "project" {
  description     = "prefix used for all resources in the Project"
  type            = string
}

variable "hosted_zone_id" {
  description     = "Route53 hosted zone ID"
  type            = string
}
