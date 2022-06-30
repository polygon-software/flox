output "user_pool_client_id" {
  value     = data.aws_ssm_parameter.user_pool_client_id.value
  sensitive = true
}

output "user_pool_id" {
  value     = data.aws_ssm_parameter.user_pool_id.value
  sensitive = true
}
