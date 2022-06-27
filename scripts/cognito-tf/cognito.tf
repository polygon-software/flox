# Cognito user pool setup

resource "aws_cognito_user_pool" "user_pool" {
  name = var.project
  auto_verified_attributes   = var.auto_verified_attributes
  username_attributes        = var.username_attributes
  mfa_configuration = var.mfa_configuration
  software_token_mfa_configuration {
    enabled = true
  }
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_cognito_user_pool_client" "app_client" {
  name         = "${var.project}Client"
  user_pool_id = aws_cognito_user_pool.user_pool.id
  access_token_validity = 1
  token_validity_units {
    access_token  = "days"
    id_token      = "days"
    refresh_token = "days"
  }
}

output "app_client_id" {
  value = aws_cognito_user_pool_client.app_client.id
}
