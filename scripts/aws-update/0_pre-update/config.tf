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
      name = "##PROJECT##-##TYPE##-pre-update" # will be replaced in preprocessing from build.bash
    }
  }
}

// Define AWS as provider
provider "aws" {
  region              = var.aws_region
  secret_key          = var.aws_secret_access_key
  access_key          = var.aws_access_key
}