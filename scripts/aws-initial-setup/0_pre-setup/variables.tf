variable "tf_api_token" {
  description     = "Terraform API token"
  type            = string
}

variable "type" {
  description     = "live, test, dev or stage-x"
  type            = string
}

variable "project" {
  description     = "prefix used for all resources in the Project"
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

variable "aws_region" {
  description     = "AWS region"
  type            = string
}

variable "aws_secret_access_key" {
  description     = "Secret access key of organisation admin"
  type            = string
}

variable "aws_access_key" {
  description     = "access key of organisation admin"
  type            = string
}

variable "domain" {
  description = "Project base domain, e.g. flox.polygon-project.ch"
  type    = string
}
