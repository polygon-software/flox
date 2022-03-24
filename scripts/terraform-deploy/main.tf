terraform {
  required_providers {
    aws = {
      source            = "hashicorp/aws"
      version           = "~> 4.00"
    }
  }
  required_version      = ">= 0.14.9"
#  backend "remote" {
#    organization        = "polygon-software"
#
#    workspaces {
#      name = "Flox-new-dev"
#    }
#  }
}

// define AWS as provider
provider "aws" {
  region                = var.aws_region
  allowed_account_ids   = [var.aws_account_id]
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

resource "aws_s3_bucket_server_side_encryption_configuration" "source_code_bucket" {
  bucket = aws_s3_bucket.source_code_bucket.bucket
  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id            = aws_kms_key.s3_encryption_key.arn
      sse_algorithm                = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "private_files" {
  bucket = aws_s3_bucket.private_files.bucket
  ignore_public_acls = true
  block_public_acls = true
  block_public_policy = true
  restrict_public_buckets = true
}
resource "aws_s3_bucket_public_access_block" "source_code" {
  bucket = aws_s3_bucket.source_code_bucket.bucket
  ignore_public_acls = true
  block_public_acls = true
  block_public_policy = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "private_files" {
  bucket = aws_s3_bucket.private_files.bucket
  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id            = aws_kms_key.s3_encryption_key.arn
      sse_algorithm                = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "public_files" {
  bucket = aws_s3_bucket.public_files.bucket
  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id            = aws_kms_key.s3_encryption_key.arn
      sse_algorithm                = "aws:kms"
    }
  }
}

// create aws s3 bucket to Upload app to
resource "aws_s3_bucket" "source_code_bucket" {
  bucket_prefix                = "${var.project}-${lookup(var.type, terraform.workspace)}-app-bucket-"
  tags = {
    Name          = "${var.project}-source-code-bucket"
  }
}
// create aws s3 bucket to Upload public files to
resource "aws_s3_bucket" "public_files" {
  bucket_prefix                = "${var.project}-${lookup(var.type, terraform.workspace)}-public-bucket-"
  tags = {
    Name          = "${var.project}-public-bucket"
  }
}
// create aws s3 bucket to Upload public files to
resource "aws_s3_bucket" "private_files" {
  bucket_prefix                = "${var.project}-${lookup(var.type, terraform.workspace)}-private-bucket-"
  tags = {
    Name          = "${var.project}-private-bucket"
  }
}

