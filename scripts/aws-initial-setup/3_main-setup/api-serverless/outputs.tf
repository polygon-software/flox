output "api_endpoint" {
  description = "Public access URL of the API"
  value       = aws_api_gateway_domain_name.api_domain.domain_name
}
