output "api_endpoint" {
  description = "Public endpoint of the EC2 instance"
  value       = aws_elastic_beanstalk_environment.api_env.endpoint_url
}
