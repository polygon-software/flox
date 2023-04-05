variable "tf_api_token" {
  description     = "Terraform API token"
  type            = string
}

variable "type" {
  description     = "live, test, dev or stage-x"
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
  default     = "eu-central-1" // Frankfurt (Germany)
  description = "AWS Region"
  type        = string
}

variable "project" {
  description     = "prefix used for all resources in the Project"
  type            = string
}

variable "domain" {
  description = "Project base domain, e.g. flox.polygon-project.ch"
  type    = string
}

variable "frontend_build_mode" {
  description     = "Build mode to use for frontend ('spa', 'pwa' or 'ssr')"
  type            = string
}
