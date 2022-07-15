output "api_eb_env_id" {
  description = "ID of the EB environment"
  value       = var.serverless == false ? module.api-ebs[0].api_eb_env_id : "" // TODO handle for serverless
}

output "api_instance_instances" {
  description = "Public IP address of the EC2 instance"
  value       = var.serverless == false ? module.api-ebs[0].api_instance_instances : "" // TODO handle for serverless
}

output "cluster_members" {
  description = "Database cluster members"
  value       = aws_rds_cluster.database_cluster.cluster_members
}

output "cluster_end" {
  description = "Database cluster endpoint"
  value       = aws_rds_cluster.database_cluster.endpoint
}

output "api_endpoint" {
  description = "Public IP address of the EC2 instance"
  value       = var.serverless == false ? module.api-ebs[0].api_endpoint : "" // TODO handle for serverless
}
