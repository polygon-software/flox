terraform {

/*  backend "remote" {
    organization = "polygon-software"
    workspaces {
      name = "terraform-testing-mh"
    }
  }*/

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

  required_version = ">= 0.14.9"
}

// define AWS as provider
provider "aws" {
  profile = "default"
  region  = "eu-central-1"
}

resource "aws_vpc" "tf_eb_vpc" {
  cidr_block = var.cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_prefix_char}-main-vpc"
  }

}

resource "aws_internet_gateway" "tf_internet_gateway" {
  vpc_id = aws_vpc.tf_eb_vpc.id

  tags = {
    Name = "${var.project_prefix_char}-internet-gateway"
  }
}

resource "aws_route_table" "tf_r_table_pri" {

  vpc_id = aws_vpc.tf_eb_vpc.id
  tags = {
    Name = "${var.project_prefix_char}-r-table-pir"
    SubnetType = "private"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route_table" "tf_r_table_pub" {
  vpc_id = aws_vpc.tf_eb_vpc.id

  tags = {
    Name = "${var.project_prefix_char}-r-table-pub"
    SubnetType = "public"
  }
}

// Create new elastic IP for the NAT
resource "aws_eip" "tf_nat_eip" {
  vpc = true
  tags = {
    Name      = "${var.project_prefix_char}-nat-eip"
    Network   = "NAT"
  }

  lifecycle {
    create_before_destroy = true
  }
}

// create nat gateway.
resource "aws_nat_gateway" "tf_nat" {

  allocation_id = aws_eip.tf_nat_eip.id
  subnet_id     = aws_subnet.web_pub_subnet[0].id

  tags = {
    Name      = "${var.project_prefix_char}-nat"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route" "tf_route_pri" {

  route_table_id         = aws_route_table.tf_r_table_pri.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.tf_nat.id

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route" "tf_route_pub" {

  route_table_id         = aws_route_table.tf_r_table_pub.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.tf_internet_gateway.id

  lifecycle {
    create_before_destroy = true
  }
}

// create aws s3 bucket to Upload app to
resource "aws_s3_bucket" "tf_app_bucket" {
  bucket = "${var.project_prefix_char}-app-bucket"

  tags = {
    Name = "${var.project_prefix_char}-app-bucket"
  }
}

// Needs to be imported with terraform import
resource "aws_route53_zone" "main_zone" {
  name            = "polygon-project.ch"
}

resource "aws_route53_record" "ebs-api-record" {
  name    = "${var.project_prefix_char}-api.polygon-project.ch"
  type    = "CNAME"
  zone_id = aws_route53_zone.main_zone.id
  ttl     = "300"
  records = [aws_elastic_beanstalk_environment.api_eb_env.endpoint_url]
}

resource "aws_route53_record" "ebs-web-record" {
  name    = "${var.project_prefix_char}-web.polygon-project.ch"
  type    = "CNAME"
  zone_id = aws_route53_zone.main_zone.id
  ttl     = "300"
  records = [aws_elastic_beanstalk_environment.web_eb_env.endpoint_url]
}
