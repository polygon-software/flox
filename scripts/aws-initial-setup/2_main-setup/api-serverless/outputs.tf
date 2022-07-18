output "api_endpoint" {
  description = "Public function URL of the Lambda function"
  value       = aws_lambda_function_url.api_lambda_url.function_url
}
