# Manually applies the current Terraform configuration in test mode.
# Necessary variables:
# - USER_POOL_ID:         Cognito User Pool ID
# - USER_POOL_CLIENT_ID:  Cognito User Pool client ID
# - COGNITO_ARN:          Amazon Resource Name (ARN) of the Cognito user pool
# - BASE_DOMAIN:          Base domain (frontend)
# - API_BASE_DOMAIN:      Base domain (backend)
# - EMAIL_SENDER:         E-mail sender address

terraform apply\
          -auto-approve\
          -var type="test"\
          -var user_pool_id="${USER_POOL_ID}"\
          -var user_pool_client_id="${USER_POOL_CLIENT_ID}"\
          -var base_domain="${BASE_DOMAIN}"\
          -var backend_base_domain="${API_BASE_DOMAIN}"\
          -var email_sender="${EMAIL_SENDER}"\
          -var cognito_arn="${COGNITO_ARN}"
