// Upload app .zip to bucket
resource "aws_s3_object" "frontend_source_code" {
  bucket                = var.source_code_bucket_id
  key                   = "${var.project}-${var.type}-web-beanstalk/frontend.zip"
  source                = "frontend.zip"
  source_hash           = filemd5("frontend.zip")
}
