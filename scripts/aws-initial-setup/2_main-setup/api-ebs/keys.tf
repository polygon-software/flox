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
