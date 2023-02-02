# Variables to store in AWS SSM Parameter store

resource "aws_ssm_parameter" "user_pool_id" {
  name  = "${var.type}-user_pool_id"
  type  = "String"
  value = aws_cognito_user_pool.user_pool.id
}

resource "aws_ssm_parameter" "user_pool_client_id" {
  name  = "${var.type}-user_pool_client_id"
  type  = "String"
  value = aws_cognito_user_pool_client.app_client.id
}

resource "aws_ssm_parameter" "cognito_arn" {
  name  = "${var.type}-cognito_arn"
  type  = "String"
  value = aws_cognito_user_pool.user_pool.arn
}

resource "aws_ssm_parameter" "hosted_zone_id" {
  name  = "${var.type}-hosted_zone_id"
  type  = "String"
  value = aws_route53_zone.zone.zone_id
}
