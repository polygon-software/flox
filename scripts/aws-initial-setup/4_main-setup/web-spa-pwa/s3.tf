// S3 bucket for uploading dist to
resource "aws_s3_bucket" "website_bucket" {
  bucket = var.domain
  tags   = {
    Name = "${var.project}-${var.type}-website-bucket"
  }

  force_destroy = var.type == "test" ? true : false

  lifecycle {
    prevent_destroy = false
  }
}

// Bucket with www. that redirects to main bucket
resource "aws_s3_bucket" "redirect_bucket" {
  bucket = "www.${var.domain}"
  tags   = {
    Name = "${var.project}-${var.type}-website-bucket-redirect"
  }

  force_destroy = var.type == "test" ? true : false

  lifecycle {
    prevent_destroy = false
  }
}

// Redirect S3 bucket ACL
resource "aws_s3_bucket_acl" "redirect_bucket_acl" {
  bucket = aws_s3_bucket.redirect_bucket.id
  acl    = "public-read"
}

// Redirect S3 bucket config
resource "aws_s3_bucket_website_configuration" "redirect_bucket_config" {
  bucket = aws_s3_bucket.redirect_bucket.bucket
  redirect_all_requests_to {
    host_name = var.domain
    protocol  = "https"
  }
}

// Website S3 bucket config
resource "aws_s3_bucket_website_configuration" "website_bucket_config" {
  bucket = aws_s3_bucket.website_bucket.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

# Website bucket configuration
resource "aws_s3_bucket_versioning" "website" {
  bucket = aws_s3_bucket.website_bucket.id
  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket                  = aws_s3_bucket.website_bucket.bucket
  ignore_public_acls      = true
  block_public_acls       = true
  block_public_policy     = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "website_bucket_policy" {
  bucket = aws_s3_bucket.website_bucket.id
  policy = data.aws_iam_policy_document.website_bucket_policy.json
}

// Modularize files with proper types
module "dist_files" {
  source   = "hashicorp/dir/template"
  base_dir = "${path.module}/frontend"
}

// Upload all dist resources to S3 Bucket
resource "aws_s3_object" "file" {
  for_each     = module.dist_files.files
  bucket       = aws_s3_bucket.website_bucket.bucket
  key          = each.key
  content_type = each.value.content_type
  source       = each.value.source_path
}
