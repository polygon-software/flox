variable "project" {
  description = "Project name"
  type        = string
}

variable "type" {
  description = "Deploy type; live, test, dev or stage-x"
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
