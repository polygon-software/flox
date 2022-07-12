output "user_pool_client_id" {
  value     = data.aws_ssm_parameter.user_pool_client_id.value
  sensitive = true
}

output "user_pool_id" {
  value     = data.aws_ssm_parameter.user_pool_id.value
  sensitive = true
}

output "cognito_arn" {
  value     = data.aws_ssm_parameter.cognito_arn.value
  sensitive = true
}

output "source_code_bucket" {
  value     = data.aws_ssm_parameter.source_code_bucket.value
  sensitive = true
}

output "hosted_zone_id" {
  value     = data.aws_ssm_parameter.hosted_zone_id.value
  sensitive = true
}
