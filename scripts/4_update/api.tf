// Upload app.zip to bucket
resource "aws_s3_object" "api_source_code_object" {
  bucket                = var.source_code_bucket
  key                   = "${var.project}-${var.type}-api-beanstalk/backend.zip"
  source                = "backend.zip"
  source_hash           = filemd5("backend.zip")
}
#
// Get elastic beanstalk resource
data "aws_elastic_beanstalk_application" "api_app" {
  name                  = "${var.project}-${var.type}-api-app"
}

// Connect eb to the s3 bucket with the app in it
resource "aws_elastic_beanstalk_application_version" "api_app_version" {
  bucket                = var.source_code_bucket
  key                   = aws_s3_object.api_source_code_object.id
  application           = data.aws_elastic_beanstalk_application.api_app.name
  name                  = "${var.project}-${var.type}-api-v-${filemd5("backend.zip")}"
}
#
#// Apply to eb environment
#data "aws_elastic_beanstalk_environment" "api_env" {
#  name                = "${var.project}-${var.type}-api-app-env"
#  application         = data.aws_elastic_beanstalk_application.api_app.name
#  solution_stack_name = "64bit Amazon Linux 2 v5.5.4 running Node.js 14"
#  description         = "Environment for API"
#  version_label       = aws_elastic_beanstalk_application_version.api_app_version.name
#}
