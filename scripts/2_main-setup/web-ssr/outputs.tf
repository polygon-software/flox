output "web_endpoint" {
  description = "Public IP address of the EC2 instance"
  value       = aws_elastic_beanstalk_environment.frontend_env.endpoint_url
}

output "frontend_env_cname" {
  description = "CNAME for frontend Elastic Beanstalk environment"
  value       = aws_elastic_beanstalk_environment.frontend_env.cname
}
