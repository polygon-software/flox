// S3 bucket for uploading dist to
resource "aws_s3_bucket" "website_bucket" {
  bucket = var.domain
  tags = {
    Name          = "${var.project}-${var.type}-website-bucket"
  }

  lifecycle {
    prevent_destroy = false
  }
}

// Website S3 config
resource "aws_s3_bucket_website_configuration" "example" {
  bucket = aws_s3_bucket.website_bucket.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}


# Bucket configuration
resource "aws_s3_bucket_versioning" "website" {
  bucket = aws_s3_bucket.website_bucket.id
  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website_bucket.bucket
  ignore_public_acls = true
  block_public_acls = true
  block_public_policy = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "website_bucket_policy" {
  bucket = aws_s3_bucket.website_bucket.id
  policy = data.aws_iam_policy_document.website_bucket_policy.json
}

// Modularize files with proper types
module "dist_files" {
  source = "hashicorp/dir/template"
  base_dir = "${path.module}/frontend"
}

// Upload all dist resources to S3 Bucket
resource "aws_s3_bucket_object" "file" {
  for_each = module.dist_files.files
  bucket      = aws_s3_bucket.website_bucket.bucket
  key          = each.key
  content_type = each.value.content_type
  source  = each.value.source_path
}
