# Variables to store in AWS SSM Parameter stores

resource "aws_ssm_parameter" "source_code_bucket" {
  name  = "${var.type}-source_code_bucket"
  type  = "String"
  value = aws_s3_bucket.source_code_bucket.bucket
}
