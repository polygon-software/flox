output "api_eb_env_id" {
  description = "ID of the EB environment"
  value       = module.api-ebs[0].api_eb_env_id
}

output "api_instance_instances" {
  description = "Public IP address of the EC2 instance"
  value       = module.api-ebs[0].api_instance_instances
}
output "cluster_members" {
  description = "Public IP address of the EC2 instance"
  value       = module.api-ebs[0].cluster_members
}

output "cluster_end" {
  description = "Public IP address of the EC2 instance"
  value       = module.api-ebs[0].cluster_end
}

output "api_endpoint" {
  description = "Public IP address of the EC2 instance"
  value       = module.api-ebs[0].api_endpoint
}
