
variable "project_prefix_char" {
  description = "prefix used for all resources in the Project"
  type = string
  default = "soi"
}

variable "instance_name" {
  description = "Value of the Name tag for the EC2 instance"
  type = string
  default = "soi-ec2"
}

variable "api" {
  description = "api"
  type = string
  default = "api"
}

variable "web" {
  description = "web"
  type = string
  default = "web"
}

variable "app_bucket" {
  description = "Id for the s3 bucket where the App should be uploaded to"
  type = string
  default = "app-zip-bucket"
}

variable "eb_frontend_name" {
  description = "Name for the Elastic beanstalk frontend app"
  type = string
  default = "terraform-eb-api"
}

variable "eb_api_name" {
  description = "Name for the Elastic beanstalk api app"
  type = string
  default = "terraform-eb-frontend"
}

variable "eb_app_desc" {
  description = "Description for the elastic Beanstalk app"
  type = string
  default = "SOI live EBS app"
}

variable "azs" {
  description = "Name for the Elastic beanstalk api app"
  type = list(string)
  default = ["eu-central-1a", "eu-central-1b", "eu-central-1c"]
}

variable "api_pub_subnet_factor" {
  description = "api_pub_subnet_factor"
  type = number
  default = 0
}

variable "api_pri_subnet_factor" {
  description = "api_pri_subnet_factor"
  type = number
  default = 3
}

variable "web_pub_subnet_factor" {
  description = "web_pub_subnet_factor"
  type = number
  default = 6
}

variable "web_pri_subnet_factor" {
  description = "web_pri_subnet_factor"
  type = number
  default = 3
}

variable "cidr_block" {
  type        = string
  description = "CIDR block for the VPC."
  default     = "10.0.0.0/23"
}

variable "SSL_certificate_id" {
  type = string
  description = "SSL certificate for domain"
  default = "arn:aws:acm:eu-central-1:923473058470:certificate/ee43abe5-4fe4-4733-910a-571bfcb0f178"
}
