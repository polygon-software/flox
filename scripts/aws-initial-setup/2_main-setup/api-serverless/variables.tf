variable "type" {
  description     = "live or test"
  type            = string
}

variable "project" {
  default         = "flox"
  description     = "prefix used for all resources in the Project"
  type            = string
}

variable "domain" {
  description = "Project base domain, e.g. flox.polygon-project.ch"
  type    = string
}

variable "api_source_code_object_id" {
  description = "S3 source code .zip ID"
  type    = string
}

variable "api_source_code_object_hash" {
  description = "S3 source code object hash"
  type    = string
}
variable "database_name" {
  description     = "Name of database"
  type            = string
}

variable "database_master_username" {
  description     = "Database user name"
  type            = string
}

variable "database_master_password" {
  description     = "Database user password"
  type            = string
}

variable "database_cluster_endpoint" {
  description     = "Database cluster endpoint"
  type            = string
}

variable "database_cluster_port" {
  description     = "Database cluster port"
  type            = string
}

variable "public_bucket_id" {
  description = "Log files bucket ID"
  type    = string
}

variable "private_bucket_id" {
  description = "Log files bucket ID"
  type    = string
}

variable "log_bucket_id" {
  description = "Log files bucket ID"
  type    = string
}

variable "aws_region" {
  default         = "eu-central-1"
  description     = "AWS Region"
  type            = string
}


variable "user_pool_id" {
  type    = string
}

variable "user_pool_client_id" {
  type    = string
}
