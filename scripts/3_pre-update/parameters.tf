data "aws_ssm_parameter" user_pool_id {
  name = "${var.type}-user_pool_id"
}

data "aws_ssm_parameter" user_pool_client_id {
  name="${var.type}-user_pool_client_id"
}

data "aws_ssm_parameter" cognito_arn {
  name="${var.type}-cognito_arn"
}

data "aws_ssm_parameter" source_code_bucket {
  name="${var.type}-source_code_bucket"
}

data "aws_ssm_parameter" hosted_zone_id {
  name="${var.type}-hosted_zone_id"
}
