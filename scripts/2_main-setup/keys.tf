resource "aws_kms_key" "rds_encryption_key" {
  deletion_window_in_days = 7
  multi_region            = true
  lifecycle {
    prevent_destroy = true
  }
  tags = {
    Name = "RDS Key"
  }
}

resource "aws_kms_key" "s3_encryption_key" {
  deletion_window_in_days = 7
  multi_region            = true
  lifecycle {
    prevent_destroy = true
  }
  tags = {
    Name = "S3 Key"
  }
}
