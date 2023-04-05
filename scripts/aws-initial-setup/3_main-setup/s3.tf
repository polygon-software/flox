resource "aws_s3_bucket_public_access_block" "private_files" {
  bucket                  = aws_s3_bucket.private_files.bucket
  ignore_public_acls      = true
  block_public_acls       = true
  block_public_policy     = true
  restrict_public_buckets = true
  provider                = aws.aws_s3_region
}

resource "aws_s3_bucket_server_side_encryption_configuration" "private_files" {
  bucket = aws_s3_bucket.private_files.bucket
  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.s3_encryption_key.arn
      sse_algorithm     = "aws:kms"
    }
  }
  provider = aws.aws_s3_region
}

resource "aws_s3_bucket_server_side_encryption_configuration" "public_files" {
  bucket = aws_s3_bucket.public_files.bucket
  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.s3_encryption_key.arn
      sse_algorithm     = "aws:kms"
    }
  }
  provider = aws.aws_s3_region
}

// Create AWS S3 bucket to upload public files to
resource "aws_s3_bucket" "public_files" {
  bucket_prefix = "${var.project}-${var.type}-public-"
  tags          = {
    Name       = "${var.project}-public-bucket"
    gcp_backup = "true"
  }

  lifecycle {
    prevent_destroy = false
  }
  provider = aws.aws_s3_region
}

// Create AWS S3 bucket to upload private files to
resource "aws_s3_bucket" "private_files" {
  bucket_prefix = "${var.project}-${var.type}-private-"
  tags          = {
    Name       = "${var.project}-private-bucket"
    gcp_backup = "true"
  }

  lifecycle {
    prevent_destroy = false
  }
  provider = aws.aws_s3_region
}

// Create AWS S3 bucket to upload log files to
resource "aws_s3_bucket" "log_files" {
  bucket_prefix = "${var.project}-${var.type}-log-"
  tags          = {
    Name       = "${var.project}-log-bucket"
    gcp_backup = "true"
  }

  lifecycle {
    prevent_destroy = false
  }
  provider = aws.aws_s3_region
}

# Bucket configurations

resource "aws_s3_bucket_policy" "log_group" {
  bucket   = aws_s3_bucket.log_files.bucket
  policy   = data.aws_iam_policy_document.log_bucket.json
  provider = aws.aws_s3_region
}

resource "aws_s3_bucket_versioning" "public" {
  bucket = aws_s3_bucket.public_files.id
  versioning_configuration {
    status = "Enabled"
  }
  provider = aws.aws_s3_region
}
resource "aws_s3_bucket_versioning" "private" {
  bucket = aws_s3_bucket.private_files.id
  versioning_configuration {
    status = "Enabled"
  }
  provider = aws.aws_s3_region
}
resource "aws_s3_bucket_versioning" "log" {
  bucket = aws_s3_bucket.log_files.id
  versioning_configuration {
    status = "Enabled"
  }
  provider = aws.aws_s3_region
}

// Create AWS S3 bucket to upload app to
resource "aws_s3_bucket" "source_code_bucket" {
  bucket_prefix = "${var.project}-${var.type}-app-"
  tags          = {
    Name = "${var.project}-source-code-bucket"
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
      kms_master_key_id = aws_kms_key.s3_encryption_key.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "source_code" {
  bucket                  = aws_s3_bucket.source_code_bucket.bucket
  ignore_public_acls      = true
  block_public_acls       = true
  block_public_policy     = true
  restrict_public_buckets = true
}

// Upload app.zip to bucket
resource "aws_s3_object" "api_source_code_object" {
  bucket      = aws_s3_bucket.source_code_bucket.bucket
  key         = "${var.project}-${var.type}-api/backend.zip"
  source      = "backend.zip"
  source_hash = filemd5("backend.zip")
}
