// S3 bucket for uploading dist to
data "aws_s3_bucket" "website_bucket" {
  bucket = var.domain
}

// Modularize files with proper types
module "dist_files" {
  source   = "hashicorp/dir/template"
  base_dir = "${path.module}/frontend"
}

// Upload all dist resources to S3 Bucket
resource "aws_s3_object" "file" {
  for_each     = module.dist_files.files
  bucket       = data.aws_s3_bucket.website_bucket.bucket
  key          = each.key
  content_type = each.value.content_type
  source       = each.value.source_path
}
