# Deploy new frontend version in SSR mode (Elastic Beanstalk)

// Upload app.zip to bucket
resource "aws_s3_object" "frontend_source_code" {
  bucket                = var.source_code_bucket_id
  key                   = "${var.project}-${var.type}-web-beanstalk/frontend.zip"
  source                = "frontend.zip"
  source_hash           = filemd5("frontend.zip")
}

// Create Elastic Beanstalk resource
resource "aws_elastic_beanstalk_application" "frontend_application" {
  name                  = "${var.project}-${var.type}-web-app"
}

// Connect EBS to the S3 bucket containing the app
resource "aws_elastic_beanstalk_application_version" "frontend_application_version" {
  bucket                = var.source_code_bucket_id
  key                   = aws_s3_object.frontend_source_code.id
  application           = aws_elastic_beanstalk_application.frontend_application.name
  name                  = "${var.project}-${var.type}-web-v-${aws_s3_object.frontend_source_code.source_hash}"
}
