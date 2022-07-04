resource "aws_vpc" "vpc" {
  cidr_block            = var.cidr_block
  enable_dns_hostnames  = true
  enable_dns_support    = true
  tags = {
    Name          = "${var.project}-${var.type}-vpc"
    Project       = var.project
  }
}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id                = aws_vpc.vpc.id

  tags = {
    Name          = "${var.project}-${var.type}-internet-gateway"
    Project       = var.project
  }
}

# Frontend modules (depending on mode)
module "web_ssr" {
  source = "./web-ssr"
  count  = var.frontend_build_mode == "ssr" ? 1 : 0
  project = var.project
  type = var.type
  cidr_block = var.cidr_block
  azs = var.azs
  vpc_id = aws_vpc.vpc.id
  internet_gateway_id = aws_internet_gateway.internet_gateway.id
  s3_encryption_key_arn = aws_kms_key.s3_encryption_key.arn
  ssl_certificate_arn = aws_acm_certificate.frontend_cert.arn
  source_code_bucket_id = aws_s3_bucket.source_code_bucket.id
}

module "web_spa_pwa" {
  source = "./web-spa-pwa"
  count  = var.frontend_build_mode != "ssr" ? 1 : 0
}

