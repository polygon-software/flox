# Cognito configuration
# (gets overwritten by tf.env)

variable "project" {
  default         = "flox"
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
