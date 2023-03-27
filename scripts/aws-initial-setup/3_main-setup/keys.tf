resource "aws_kms_key" "s3_encryption_key" {
  deletion_window_in_days = 7
  multi_region            = true
  lifecycle {
    prevent_destroy = false
  }
  tags = {
    Name = "S3 Key"
  }
  provider = aws.aws_s3_region
}

resource "aws_kms_key" "rds_encryption_key" {
  deletion_window_in_days = 7
  multi_region            = true
  lifecycle {
    prevent_destroy = false
  }
  tags = {
    Name = "RDS Key"
  }
}
