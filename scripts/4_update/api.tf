// Upload app.zip to bucket
resource "aws_s3_object" "api_source_code_object" {
  bucket                = var.source_code_bucket
  key                   = "${var.project}-${var.type}-api-beanstalk/backend.zip"
  source                = "backend.zip"
  source_hash           = filemd5("backend.zip")
}

// Get elastic beanstalk app resource
data "aws_elastic_beanstalk_application" "api_app" {
  name                  = "${var.project}-${var.type}-api-app"
}

// Create new application version
resource "aws_elastic_beanstalk_application_version" "api_app_version" {
  bucket                = var.source_code_bucket
  key                   = aws_s3_object.api_source_code_object.id
  application           = data.aws_elastic_beanstalk_application.api_app.name
  name                  = "${var.project}-${var.type}-api-v-${filemd5("backend.zip")}"
}
