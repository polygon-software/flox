# TODO: do based on flox.config.js
resource "aws_cognito_user_pool" "user_pool" {
  name = var.project
  auto_verified_attributes   = ["email"]
  username_attributes        = ["email"]
  mfa_configuration = "ON"
  software_token_mfa_configuration {
    enabled = true
  }
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_cognito_user_pool_client" "app_client" {
  name         = "FloxClient" # TODO: based on .env
  user_pool_id = aws_cognito_user_pool.user_pool.id
  access_token_validity = 1
  token_validity_units {
    access_token  = "days"
    id_token      = "days"
    refresh_token = "days"
  }
}
