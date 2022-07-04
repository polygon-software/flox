variable "project" {
  description = "Project name"
  type = string
}

variable "type" {
  description = "Deploy type (live or test)"
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

variable "source_code_bucket_id" {
  description     = "Source code bucket ID"
  type            = string
}

variable "private_subnet_ids" {
  description = "Ids of the private Subnets"
  type = list(string)
}

variable "public_subnet_ids" {
  description = "Ids of the private Subnets"
  type = list(string)
}
