variable "type" {
  description     = "live or test"
  type            = string
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
  default         = "flox"
  description     = "prefix used for all resources in the Project"
  type            = string
}

