// Create AWS S3 bucket to upload app to
resource "aws_s3_bucket" "source_code_bucket" {
  bucket_prefix   = "${var.project}-${var.type}-app-bucket-"
  tags = {
    Name          = "${var.project}-source-code-bucket"
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_s3_bucket_versioning" "source" {
  bucket = aws_s3_bucket.source_code_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "source_code_bucket" {
  bucket = aws_s3_bucket.source_code_bucket.bucket
  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id            = ***REMOVED***
      sse_algorithm                = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "source_code" {
  bucket = aws_s3_bucket.source_code_bucket.bucket
  ignore_public_acls = true
  block_public_acls = true
  block_public_policy = true
  restrict_public_buckets = true
}
