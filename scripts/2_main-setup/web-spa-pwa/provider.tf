// Define alternate region AWS as provider
provider "aws" {
  region              = "us-east-1"
  secret_key          = var.aws_secret_access_key
  access_key          = var.aws_access_key
  alias               = "us-east"
}
