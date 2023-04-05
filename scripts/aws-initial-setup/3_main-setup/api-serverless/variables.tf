variable "type" {
  description = "live, test, dev or stage-x"
  type        = string
}

variable "project" {
  description = "prefix used for all resources in the Project"
  type        = string
}

variable "domain" {
  description = "Project base domain, e.g. flox.polygon-project.ch"
  type        = string
}

variable "api_source_code_object_key" {
  description = "S3 source code .zip key"
  type        = string
}

variable "api_source_code_object_hash" {
  description = "S3 source code object hash"
  type        = string
}

variable "database_name" {
  description = "Name of database"
  type        = string
}

variable "database_master_username" {
  description = "Database user name"
  type        = string
}

variable "database_master_password" {
  description = "Database user password"
  type        = string
}

variable "database_cluster_endpoint" {
  description = "Database cluster endpoint"
  type        = string
}

variable "database_cluster_port" {
  description = "Database cluster port"
  type        = string
}

variable "public_bucket_id" {
  description = "Public bucket ID"
  type        = string
}

variable "private_bucket_id" {
  description = "Private bucket ID"
  type        = string
}

variable "log_bucket_id" {
  description = "Log files bucket ID"
  type        = string
}

variable "source_code_bucket_id" {
  description = "Source code bucket ID"
  type        = string
}

variable "aws_region" {
  default     = "eu-central-1" // Frankfurt (Germany)
  description = "AWS Region"
  type        = string
}

variable "aws_s3_region" {
  default     = "eu-central-1" // Frankfurt (Germany)
  description = "AWS Region of S3 buckets"
  type        = string
}

variable "user_pool_id" {
  type = string
}

variable "user_pool_client_id" {
  type = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs"
  type        = list(string)
}

variable "public_subnet_ids" {
  description = "Public subnet IDs"
  type        = list(string)
}

variable "database_subnet_ids" {
  description = "Database subnet IDs"
  type        = list(string)
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "backend_certificate_arn" {
  description = "Backend SSL certificate ARN"
  type        = string
}

variable "api_security_group_id" {
  description = "API security group ID"
  type        = string
}

variable "database_ec2_to_rds_security_group_id" {
  description = "EC2->RDS access security group ID"
  type        = string
}

variable "admin_key_id" {
  description = "ID of admin user programmatic access key"
  type        = string
}

variable "admin_key_secret" {
  description = "Secret of admin user programmatic access key"
  type        = string
}
