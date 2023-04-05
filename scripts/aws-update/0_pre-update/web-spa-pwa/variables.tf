variable "aws_access_key" {
  description     = "aws_access_key_id"
  type            = string
}

variable "aws_secret_access_key" {
  description     = "aws_secret_access_key"
  type            = string
}

variable "aws_region" {
  default     = "eu-central-1" // Frankfurt (Germany)
  description = "AWS Region"
  type        = string
}

variable "domain" {
  description = "Project base domain, e.g. flox.polygon-project.ch"
  type    = string
}
