data "aws_ssm_parameter" user_pool_id {
  name = "user_pool_id"
}

data "aws_ssm_parameter" user_pool_client_id {
  name="user_pool_client_id"
}
