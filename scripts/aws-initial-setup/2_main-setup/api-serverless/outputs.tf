output "api_endpoint" {
  description = "Public function URL of the Lambda function"
  value       =   aws_api_gateway_deployment.api_gateway_deployment.invoke_url // TODO make route53 record...
  #  value       = aws_api_gateway_domain_name.api_domain.domain_name
#  value       = aws_lambda_function_url.api_lambda_url.function_url
}
