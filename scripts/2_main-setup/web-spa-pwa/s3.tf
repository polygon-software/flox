// Create AWS S3 bucket to upload app to
resource "aws_s3_bucket" "website_bucket" {
  bucket = var.domain
  acl = "public-read"
  tags = {
    Name          = "${var.project}-${var.type}-website-bucket"
  }
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
  lifecycle {
    prevent_destroy = false
  }
}

#resource "aws_s3_bucket_website_configuration" "website_bucket_config"{
#  TODO instead of website param
#}

# Bucket configuration
resource "aws_s3_bucket_versioning" "website" {
  bucket = aws_s3_bucket.website_bucket.id
  versioning_configuration {
    status = "Disabled"
  }
}

# TODO enable
#resource "aws_s3_bucket_public_access_block" "website" {
#  bucket = aws_s3_bucket.website_bucket.bucket
#  ignore_public_acls = true
#  block_public_acls = true
#  block_public_policy = true
#  restrict_public_buckets = true
#}

#resource "aws_s3_bucket_policy" "website_bucket_policy" {
#  bucket = aws_s3_bucket.website_bucket.id
#  policy = data.aws_iam_policy_document.website_bucket_policy.json
#}

#TODO TEST
#resource "aws_s3_bucket_object" "test_file" {
#  bucket      = aws_s3_bucket.website_bucket.id
#  key         = "test/index.html"
#  source       = "flox.polygon-project.ch/frontend/index.html"
#  source_hash = filemd5("${path.module}/frontend/index.html")
#  acl         = "public-read"
#}

#TODO probably still bogo banane
resource "aws_s3_bucket_object" "file" {
  for_each = fileset("${path.module}/frontend", "**")
  bucket      = aws_s3_bucket.website_bucket.bucket
  key         = each.value
  source       = "${path.module}/frontend/${each.value}"
  source_hash = filemd5("${path.module}/frontend/${each.value}")
  acl         = "public-read"
}
