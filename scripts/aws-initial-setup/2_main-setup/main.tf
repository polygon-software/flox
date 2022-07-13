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

# Frontend module (SSR)
module "web_ssr" {
  source = "web-ssr"
  count  = var.frontend_build_mode == "ssr" ? 1 : 0
  project = var.project
  type = var.type
  cidr_block = var.cidr_block
  azs = var.azs
  vpc_id = aws_vpc.vpc.id
  source_code_bucket_id = aws_s3_bucket.source_code_bucket.id
  private_subnet_ids = aws_subnet.private_subnet.*.id
  public_subnet_ids = aws_subnet.public_subnet.*.id
  hosted_zone_id = var.hosted_zone_id
  domain = var.base_domain
}

# Frontend module (PWA/SPA)
module "web_spa_pwa" {
  source = "web-spa-pwa"
  count  = var.frontend_build_mode != "ssr" ? 1 : 0
  project = var.project
  type = var.type
  domain = var.base_domain
  hosted_zone_id = var.hosted_zone_id
  aws_access_key = var.aws_access_key
  aws_secret_access_key = var.aws_secret_access_key
  providers = {
    aws = aws.us-east-1
  }
}

# Backend module (EBS) TODO variables
module "api-ebs" {
  source = "api-ebs"
  count  = var.serverless == true ? 0 : 1
  project = var.project
  type = var.type
  domain = var.base_domain
  hosted_zone_id = var.hosted_zone_id
  eb_app_desc = var.eb_app_desc
  private_subnet_ids = aws_subnet.private_subnet.*.id
  public_subnet_ids = aws_subnet.public_subnet.*.id
}

# Backend module (Serverless) TODO variables
module "api-serverless" {
  source = "api-serverless"
  count  = var.serverless == true ? 1 : 0
  project = var.project
  type = var.type
  domain = var.base_domain
  hosted_zone_id = var.hosted_zone_id
}
