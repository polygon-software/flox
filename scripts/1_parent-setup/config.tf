terraform {
  required_providers {
    aws = {
      source            = "hashicorp/aws"
      version           = "~> 4.00"
    }
  }
  required_version      = ">= 0.14.9"
  cloud {
    organization        = "##ORGANISATION##"

    workspaces {
      name = "##PROJECT##-##TYPE##-hosted-zone" # will be replaced in preprocessing
    }
  }
}

// Define AWS as provider
provider "aws" {
  region              = var.aws_region
  secret_key          = var.domain_manager_aws_secret_access_key
  access_key          = var.domain_manager_aws_access_key
}
