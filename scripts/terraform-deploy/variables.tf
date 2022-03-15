variable "type" {
  description     = "live or test or testV2..."
  type            = string
}

variable "aws_region" {
  default         = "eu-central-1"
  description     = "AWS Region"
  type            = string
}
variable "project" {
  default         = "soi"
  description     = "prefix used for all resources in the Project"
  type            = string
}

variable "api" {
  default         = "api"
  description     = "api"
  type            = string
}

variable "web" {
  default         = "web"
  description     = "web"
  type            = string
}

variable "app_bucket" {
  default         = "app-zip-bucket"
  description     = "Id for the s3 bucket where the App should be uploaded to"
  type            = string
}

variable "eb_app_desc" {
  default         = "SOI live EBS app"
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
  default         = "10.0.0.0/23"
  description     = "CIDR block for the VPC."
  type            = string
}

variable "SSL_certificate_id" {
  default         = "arn:aws:acm:eu-central-1:923473058470:certificate/ee43abe5-4fe4-4733-910a-571bfcb0f178"
  description     = "SSL certificate for domain"
  type            = string
}

variable "certificate_base_path" {
  default         = "/Users/johannschwabe/Documents/git/easy-rsa/easyrsa3/pki"
  description     = "Path to the RSA keys directory"
  type            = string
}

variable "database_name" {
  default         = "soi_db"
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

variable "route53_zone_id" {
  default         = "Z04147162VG4FVTUKDUBB"
  description     = "ID of hosted Zone"
  type            = string
}
variable "superdomain" {
  default         = "polygon-project.ch"
  description     = "Domain where a subdomain should be added to"
  type            = string
}
