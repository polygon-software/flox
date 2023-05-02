resource "aws_vpc" "vpc" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags                 = {
    Name    = "${var.project}-${var.type}-vpc"
    Project = var.project
  }
}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.vpc.id
  tags   = {
    Name    = "${var.project}-${var.type}-internet-gateway"
    Project = var.project
  }
}

# Frontend module (SSR)
module "web_ssr" {
  source                = "./web-ssr"
  count                 = var.frontend_build_mode == "ssr" ? 1 : 0
  project               = var.project
  type                  = var.type
  cidr_block            = var.cidr_block
  azs                   = var.azs
  vpc_id                = aws_vpc.vpc.id
  source_code_bucket_id = aws_s3_bucket.source_code_bucket.id
  private_subnet_ids    = aws_subnet.private_subnet.*.id
  public_subnet_ids     = aws_subnet.public_subnet.*.id
  hosted_zone_id        = var.hosted_zone_id
  domain                = var.domain
}

# Frontend module (PWA/SPA)
module "web_spa_pwa" {
  source                = "./web-spa-pwa"
  count                 = var.frontend_build_mode != "ssr" ? 1 : 0
  project               = var.project
  type                  = var.type
  domain                = var.domain
  hosted_zone_id        = var.hosted_zone_id
  aws_access_key        = var.aws_access_key
  aws_secret_access_key = var.aws_secret_access_key
  aws_region            = "us-east-1"
  providers             = {
    aws = aws.us-east-1
  }
}

# Backend module (EBS + RDS)
module "api_ebs" {
  source                        = "./api-ebs"
  count                         = var.serverless_api == true ? 0 : 1
  project                       = var.project
  type                          = var.type
  domain                        = var.domain
  hosted_zone_id                = var.hosted_zone_id
  eb_app_desc                   = var.eb_app_desc
  private_subnet_ids            = aws_subnet.private_subnet.*.id
  public_subnet_ids             = aws_subnet.public_subnet.*.id
  api_iam_instance_profile_name = aws_iam_instance_profile.api.name
  backend_certificate_arn       = aws_acm_certificate.backend_cert.arn
  source_code_bucket_id         = aws_s3_bucket.source_code_bucket.id
  private_bucket_id             = aws_s3_bucket.private_files.id
  public_bucket_id              = aws_s3_bucket.public_files.id
  log_bucket_id                 = aws_s3_bucket.log_files.id
  user_pool_id                  = var.user_pool_id
  user_pool_client_id           = var.user_pool_client_id
  vpc_id                        = aws_vpc.vpc.id
  database_name                 = var.database_name
  database_master_username      = var.database_master_username
  database_master_password      = var.database_master_password
  database_subnet_ids           = aws_subnet.database_subnets.*.id
  database_cluster_endpoint     = aws_rds_cluster.database_cluster.endpoint
  database_cluster_port         = aws_rds_cluster.database_cluster.port
  api_source_code_object_id     = aws_s3_object.api_source_code_object.id
  api_source_code_object_hash   = aws_s3_object.api_source_code_object.source_hash
  aws_region                    = var.aws_region
  aws_s3_region                 = var.aws_s3_region
  api_security_group_id         = aws_security_group.api_security_group.id
  admin_key_id                  = aws_iam_access_key.backend_admin_key.id
  admin_key_secret              = aws_iam_access_key.backend_admin_key.secret
  stripe_secret_key             = var.stripe_secret_key
}

# Certificate for serverless mode backend
module "api_serverless_certificate" {
  source         = "./api-serverless-certificate"
  count          = var.serverless_api == true ? 1 : 0
  domain         = var.domain
  hosted_zone_id = var.hosted_zone_id
  providers      = {
    aws = aws.us-east-1
  }
}

# Backend module (Serverless)
module "api_serverless" {
  source                                = "./api-serverless"
  count                                 = var.serverless_api == true ? 1 : 0
  depends_on                            = [module.api_serverless_certificate]
  project                               = var.project
  type                                  = var.type
  domain                                = var.domain
  hosted_zone_id                        = var.hosted_zone_id
  api_source_code_object_key            = aws_s3_object.api_source_code_object.key
  api_source_code_object_hash           = aws_s3_object.api_source_code_object.source_hash
  aws_region                            = var.aws_region
  aws_s3_region                         = var.aws_s3_region
  database_name                         = var.database_name
  database_master_username              = var.database_master_username
  database_master_password              = var.database_master_password
  database_cluster_endpoint             = aws_rds_cluster.database_cluster.endpoint
  database_cluster_port                 = aws_rds_cluster.database_cluster.port
  database_subnet_ids                   = aws_subnet.database_subnets.*.id
  source_code_bucket_id                 = aws_s3_bucket.source_code_bucket.id
  private_bucket_id                     = aws_s3_bucket.private_files.id
  public_bucket_id                      = aws_s3_bucket.public_files.id
  log_bucket_id                         = aws_s3_bucket.log_files.id
  user_pool_id                          = var.user_pool_id
  user_pool_client_id                   = var.user_pool_client_id
  private_subnet_ids                    = aws_subnet.private_subnet.*.id
  public_subnet_ids                     = aws_subnet.public_subnet.*.id
  vpc_id                                = aws_vpc.vpc.id
  backend_certificate_arn               = module.api_serverless_certificate[0].backend_certificate_arn
  api_security_group_id                 = aws_security_group.api_security_group.id
  database_ec2_to_rds_security_group_id = aws_security_group.database_ec2_to_rds_security_group[0].id
  admin_key_id                          = aws_iam_access_key.backend_admin_key.id
  admin_key_secret                      = aws_iam_access_key.backend_admin_key.secret
  stripe_secret_key                     = var.stripe_secret_key
  // TODO actually use on EBS & lambda
}
