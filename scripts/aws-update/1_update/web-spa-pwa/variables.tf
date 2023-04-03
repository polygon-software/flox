variable "domain" {
  description = "Deployment domain (e.g. flox.polygon-project.ch), which is also the S3 bucket's name"
  type        = string
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
  default     = "eu-central-1" // Frankfurt (Germany)
  description = "AWS region"
  type        = string
}

variable "aws_s3_region" {
  default     = "eu-central-1" // Frankfurt (Germany)
  description = "AWS Region of S3 buckets"
  type        = string
}
