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

variable "source_code_bucket_id" {
  description     = "Source code bucket ID"
  type            = string
}

variable "hosted_zone_id" {
  description     = "Route53 hosted zone ID"
  type            = string
}

variable "user_pool_id" {
  type    = string
}

variable "user_pool_client_id" {
  type    = string
}

variable "aws_region" {
  default         = "eu-central-1"
  description     = "AWS Region"
  type            = string
}

variable "backend_certificate_arn" {
  description     = "Backend SSL certificate ARN"
  type            = string
}

variable "eb_app_desc" {
  default         = "EBS app"
  description     = "Description for the elastic Beanstalk app"
  type            = string
}

variable "api_iam_instance_profile_name" {
  description     = "IAM instance profile name for API"
  type            = string
}

variable "vpc_id" {
  description     = "VPC ID"
  type            = string
}

variable "private_subnet_ids" {
  description     = "Private subnet IDs"
  type            = list(string)
}

variable "public_subnet_ids" {
  description     = "Public subnet IDs"
  type            = list(string)
}

variable "database_subnet_ids" {
  description     = "Database subnet IDs"
  type            = list(string)
}

variable "azs" {
  description = "Availability zones"
  type = list(string)
}

variable "cidr_block" {
  description = "CIDR block"
  type = string
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

variable "api_security_group_id" {
  description     = "API security group ID"
  type            = string
}
