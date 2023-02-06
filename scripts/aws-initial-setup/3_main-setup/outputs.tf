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
  value       = var.serverless_api == false ? module.api_ebs[0].api_endpoint : module.api_serverless[0].api_endpoint
}

output "admin_key_id" {
  description = "ID of the admin user's key (so it can be used locally in backend.env)"
  value       = aws_iam_access_key.backend_admin_key.id
  sensitive   = true
}

output "admin_key_secret" {
  description = "Secret of the admin user's key (so it can be used locally in backend.env)"
  value       = aws_iam_access_key.backend_admin_key.secret
  sensitive   = true
}
