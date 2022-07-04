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
  count  = var.frontend_build_mode == 'ssr' ? 1 : 0
  project = var.project
}

module "web_spa_pwa" {
  source = "./web-spa-pwa"
  count  = var.frontend_build_mode != 'ssr' ? 1 : 0
}

