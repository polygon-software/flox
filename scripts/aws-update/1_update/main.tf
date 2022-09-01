# Frontend modules (depending on mode)
module "web_ssr" {
  source = "./web-ssr"
  count  = var.frontend_build_mode == "ssr" ? 1 : 0
  project = var.project
  type = var.type
  source_code_bucket_id = var.source_code_bucket
}

module "web_spa_pwa" {
  source = "./web-spa-pwa"
  count  = var.frontend_build_mode != "ssr" ? 1 : 0
  domain = var.domain
  aws_access_key = var.aws_access_key
  aws_secret_access_key = var.aws_secret_access_key
  aws_region = "us-east-1"
  providers = {
    aws = aws.us-east-1
  }
}
