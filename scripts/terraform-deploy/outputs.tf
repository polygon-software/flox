output "api_eb_env_id" {
  description = "ID of the EB environment"
  value       = aws_elastic_beanstalk_environment.api_eb_env.id
}

output "api_instance_instances" {
  description = "Public IP address of the EC2 instance"
  value       = aws_elastic_beanstalk_environment.api_eb_env.instances
}
output "cluster_members" {
  description = "Public IP address of the EC2 instance"
  value       = aws_rds_cluster.tf_db_cluster.cluster_members
}
output "cluster_end" {
  description = "Public IP address of the EC2 instance"
  value       = aws_rds_cluster.tf_db_cluster.endpoint
}

output "api_endpoint" {
  description = "Public IP address of the EC2 instance"
  value       = aws_elastic_beanstalk_environment.api_eb_env.endpoint_url
}

output "web_endpoint" {
  description = "Public IP address of the EC2 instance"
  value       = aws_elastic_beanstalk_environment.web_eb_env.endpoint_url
}
/*
output "frontend_eb_env_id" {
  description = "ID of the EB environment"
  value       = aws_elastic_beanstalk_environment.frontend_eb_env.id
}

output "frontend_instance_instances" {
  description = "Public IP address of the EC2 instance"
  value       = aws_elastic_beanstalk_environment.frontend_eb_env.instances
}

output "vpc_id" {
  value = aws_vpc.terraform_eb_vpc.id
}
*/
