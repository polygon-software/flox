variable "project" {
  description = "Project name"
  type = string
}

variable "type" {
  description = "Deploy type (live or test)"
  type = string
}

variable "s3_encryption_key_arn" {
  description = "S3 encryption key ARN"
  type = string
}

variable "ssl_certificate_arn" {
  description = "SSL certificate ARN"
  type = string
}

variable "vpc_id" {
  description = "VPC ID"
  type = string
}

variable "cidr_block" {
  description = "CIDR block"
  type = string
}

variable "azs" {
  description = "Availability zones"
  type = list(string)
}

variable "internet_gateway_id" {
  description = "Internet gateway ID"
  type = string
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
