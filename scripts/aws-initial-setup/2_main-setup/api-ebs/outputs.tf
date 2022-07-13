output "api_eb_env_id" {
  description = "ID of the EB environment"
  value       = aws_elastic_beanstalk_environment.api_env.id
}

output "api_instance_instances" {
  description = "Public IP address of the EC2 instance"
  value       = aws_elastic_beanstalk_environment.api_env.instances
}

output "api_endpoint" {
  description = "Public IP address of the EC2 instance"
  value       = aws_elastic_beanstalk_environment.api_env.endpoint_url
}
