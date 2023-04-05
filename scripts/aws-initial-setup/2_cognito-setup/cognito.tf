# Cognito user pool setup

resource "aws_cognito_user_pool" "user_pool" {
  name = "${var.project}-${var.type}"
  auto_verified_attributes   = var.auto_verified_attributes
  username_attributes        = var.username_attributes
  mfa_configuration = var.mfa_configuration
  dynamic "software_token_mfa_configuration" {
    for_each = var.mfa_configuration == "OFF" ? [] : [1]
    content {
      enabled = true
    }
  }
  email_configuration {
    email_sending_account = "DEVELOPER"
    from_email_address = "noreply@${var.domain}"
    source_arn = aws_ses_domain_identity.ses_domain.arn
  }
  depends_on = [aws_ses_domain_identity_verification.ses_domain_verification]
  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_cognito_user_pool_client" "app_client" {
  name         = "${var.project}-${var.type}-Client"
  user_pool_id = aws_cognito_user_pool.user_pool.id
  access_token_validity = 1
  token_validity_units {
    access_token  = "days"
    id_token      = "days"
    refresh_token = "days"
  }
}
