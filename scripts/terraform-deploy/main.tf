terraform {
  required_providers {
    aws = {
      source            = "hashicorp/aws"
      version           = "~> 3.27"
    }
  }
  required_version      = ">= 0.14.9"
  backend "remote" {
    organization        = "polygon-software"

    workspaces {
      name = "Flox-dev"
    }
  }
}


// define AWS as provider
provider "aws" {
  profile               = "default"
  region                = var.aws_region
  secret_key          = var.aws_secret_access_key
  access_key          = var.aws_access_key
}

resource "aws_vpc" "vpc" {
  cidr_block            = var.cidr_block
  enable_dns_hostnames  = true
  enable_dns_support    = true

  tags = {
    Name          = "${var.project}-${lookup(var.type, terraform.workspace)}-vpc"
    Project       = var.project
  }

}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id                = aws_vpc.vpc.id

  tags = {
    Name          = "${var.project}-${lookup(var.type, terraform.workspace)}-internet-gateway"
    Project       = var.project
  }
}

resource "aws_route_table" "route_table_private" {
  vpc_id                = aws_vpc.vpc.id
  tags = {
    Name          = "${var.project}-${lookup(var.type, terraform.workspace)}-${var.web}-route-table-private"
    Project       = var.project
    SubnetType    = "private"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route_table" "route_table_public" {
  vpc_id                = aws_vpc.vpc.id

  tags = {
    Name          = "${var.project}-${lookup(var.type, terraform.workspace)}-route-table-public"
    Project       = var.project
    SubnetType    = "public"
  }
}

// Create new elastic IP for the NAT
// @Cloudmates: needed?
resource "aws_eip" "web_nat_elastic_ip" {
  vpc                   = true
  tags = {
    Name          = "${var.project}-${lookup(var.type, terraform.workspace)}-${var.web}-nat-eip"
    Project       = var.project
  }

  lifecycle {
    create_before_destroy = true
  }
}

// Create nat gateway. @Cloudmates: Is that needed?
resource "aws_nat_gateway" "frontend_nat" {
  allocation_id         = aws_eip.web_nat_elastic_ip.id
  subnet_id             = aws_subnet.frontend_public_subnet[0].id

  tags = {
    Name          = "${var.project}-${lookup(var.type, terraform.workspace)}-${var.web}-nat"
    Project       = var.project
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route" "frontend_route_private" {
  route_table_id        = aws_route_table.route_table_private.id
  destination_cidr_block= "0.0.0.0/0"
  nat_gateway_id        = aws_nat_gateway.frontend_nat.id
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route" "frontend_route_public" {
  route_table_id        = aws_route_table.route_table_public.id
  destination_cidr_block= "0.0.0.0/0"
  gateway_id            = aws_internet_gateway.internet_gateway.id
  lifecycle {
    create_before_destroy = true
  }
}

// create aws s3 bucket to Upload app to
resource "aws_s3_bucket" "source_code_bucket" {
  bucket                = "${var.project}-${lookup(var.type, terraform.workspace)}-app-bucket"
  tags = {
    Name          = "${var.project}-source-code-bucket"
    Project       = var.project
  }
}
// create aws s3 bucket to Upload public files to
resource "aws_s3_bucket" "public_files" {
  bucket                = "${var.project}-${lookup(var.type, terraform.workspace)}-public-bucket"
  tags = {
    Name          = "${var.project}-public-bucket"
    Project       = var.project
  }
}
// create aws s3 bucket to Upload public files to
resource "aws_s3_bucket" "private_files" {
  bucket                = "${var.project}-${lookup(var.type, terraform.workspace)}-private-bucket"
  acl                   = "private"
  tags = {
    Name          = "${var.project}-private-bucket"
    Project       = var.project
  }
}

resource "aws_route53_record" "api_record" {
  name                  = "${var.project}-${lookup(var.type, terraform.workspace)}-${var.api}.${var.superdomain}"
  type                  = "CNAME"
  zone_id               = var.route53_zone_id
  ttl                   = "300"
  records               = [aws_elastic_beanstalk_environment.api_env.endpoint_url]
}

resource "aws_route53_record" "web_record" {
  name                  = "${var.project}-${lookup(var.type, terraform.workspace)}-${var.web}.${var.superdomain}"
  type                  = "CNAME"
  zone_id               = var.route53_zone_id
  ttl                   = "300"
  records               = [aws_elastic_beanstalk_environment.frontend_env.endpoint_url]
}
