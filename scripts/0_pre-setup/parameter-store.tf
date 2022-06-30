# Variables to store in AWS SSM Parameter store

resource "aws_ssm_parameter" "user_pool_id" {
  name  = "user_pool_id"
  type  = "String"
  value = aws_cognito_user_pool.user_pool.id
}

resource "aws_ssm_parameter" "user_pool_client_id" {
  name  = "user_pool_client_id"
  type  = "String"
  value = aws_cognito_user_pool_client.app_client.id
}

