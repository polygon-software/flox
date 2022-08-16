variable "project" {
  description = "Project name"
  type = string
}

variable "type" {
  description     = "Deploy type; live, test, dev or stage-x"
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
  description = "IDs of the private Subnets"
  type = list(string)
}

variable "public_subnet_ids" {
  description = "IDs of the public Subnets"
  type = list(string)
}

variable "hosted_zone_id" {
  description = "Domain hosted zone ID"
  type        = string
}

variable "domain" {
  description = "Deployment domain (e.g. flox.polygon-project.ch)"
  type        = string
}
