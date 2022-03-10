variable "aws_region" {
  default         = "eu-central-1"
  description     = "AWS Region"
  type            = string
}
variable "project" {
  description     = "prefix used for all resources in the Project"
  type            = string
  default         = "soi"
}

variable "api" {
  description     = "api"
  type            = string
  default         = "api"
}

variable "type" {
  description     = "live or test or testV2..."
  default         = "test"
  type            = string
}

variable "web" {
  description     = "web"
  type            = string
  default         = "web"
}

variable "app_bucket" {
  description     = "Id for the s3 bucket where the App should be uploaded to"
  type            = string
  default         = "app-zip-bucket"
}

variable "eb_frontend_name" {
  description     = "Name for the Elastic beanstalk frontend app"
  type            = string
  default         = "terraform-eb-api"
}

variable "eb_api_name" {
  description     = "Name for the Elastic beanstalk api app"
  type            = string
  default         = "terraform-eb-frontend"
}

variable "eb_app_desc" {
  description     = "Description for the elastic Beanstalk app"
  type            = string
  default         = "SOI live EBS app"
}

variable "azs" {
  description     = "Name for the Elastic beanstalk api app"
  type            = list(string)
  default = ["eu-central-1a", "eu-central-1b", "eu-central-1c"]
}

variable "api_pub_subnet_factor" {
  description     = "api_pub_subnet_factor"
  type            = number
  default         = 0
}

variable "api_pri_subnet_factor" {
  description     = "api_pri_subnet_factor"
  type            = number
  default         = 3
}

variable "web_pub_subnet_factor" {
  description     = "web_pub_subnet_factor"
  type            = number
  default         = 6
}

variable "web_pri_subnet_factor" {
  description     = "web_pri_subnet_factor"
  type            = number
  default         = 3
}

variable "cidr_block" {
  type            = string
  description     = "CIDR block for the VPC."
  default         = "10.0.0.0/23"
}

variable "SSL_certificate_id" {
  type            = string
  description     = "SSL certificate for domain"
  default         = "arn:aws:acm:eu-central-1:923473058470:certificate/ee43abe5-4fe4-4733-910a-571bfcb0f178"
}

variable "certificate_base_path" {
  type            = string
  default         = "/Users/johannschwabe/Documents/git/easy-rsa/easyrsa3/pki"
  description     = "Path to the RSA keys directory"
}

variable "database_name" {
  type            = string
  default         = "soi_db"
  description     = "Name of database"
}

variable "database_master_username" {
  type            = string
  default         = "db_user"
  description     = "Database user name"
}

variable "database_master_password" {
  type            = string
  default         = "db_user_pass"
  description     = "Database user password"
}

variable "route53_zone_id" {
  type            = string
  default         = "Z04147162VG4FVTUKDUBB"
  description     = "ID of hosted Zone"
}
variable "superdomain" {
  type            = string
  default         = "polygon-project.ch"
  description     = "Domain where a subdomain should be added to"
}
