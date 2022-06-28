variable "type" {
  description     = "live or test"
  type            = string
}

variable "cognito_arn" {
  type = string
}

variable "gcb_backup_user_name" {
  type = string
  default = "gcp-backup-manager"
}

variable "base_domain" {
  description = "Frontend base domain, e.g. flox.polygon-project.ch"
  type    = string
}

variable "email_sender" {
  description = "Default e-mail sending address"
  type    = string
}

variable "user_pool_id" {
  type    = string
}

variable "user_pool_client_id" {
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
  default         = "flox"
  description     = "prefix used for all resources in the Project"
  type            = string
}

variable "eb_app_desc" {
  default         = "EBS app"
  description     = "Description for the elastic Beanstalk app"
  type            = string
}

variable "azs" {
  default         = ["eu-central-1a", "eu-central-1b", "eu-central-1c"]
  description     = "Name for the Elastic beanstalk api app"
  type            = list(string)
}

variable "api_pub_subnet_factor" {
  default         = 0
  description     = "api_pub_subnet_factor"
  type            = number
}

variable "api_pri_subnet_factor" {
  default         = 3
  description     = "api_pri_subnet_factor"
  type            = number
}

variable "web_pub_subnet_factor" {
  default         = 6
  description     = "web_pub_subnet_factor"
  type            = number
}

variable "web_pri_subnet_factor" {
  default         = 3
  description     = "web_pri_subnet_factor"
  type            = number
}

variable "cidr_block" {
  default         = "10.0.0.0/19"
  description     = "CIDR block for the VPC."
  type            = string
}

variable "database_name" {
  default         = "app_db"
  description     = "Name of database"
  type            = string
}

variable "database_master_username" {
  default         = "db_user"
  description     = "Database user name"
  type            = string
}

variable "database_master_password" {
  default         = "db_user_pass"
  description     = "Database user password"
  type            = string
}
