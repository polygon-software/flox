// Upload app .zip to bucket
resource "aws_s3_object" "api_source_code_object" {
  bucket                = var.source_code_bucket
  key                   = "${var.project}-${var.type}-api/backend.zip"
  source                = "backend.zip"
  source_hash           = filemd5("backend.zip")
}
