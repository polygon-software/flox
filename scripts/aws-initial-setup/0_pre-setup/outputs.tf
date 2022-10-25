# User Pool
output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.app_client.id
}

output "user_pool_id" {
  value = aws_cognito_user_pool.user_pool.id
}

output "user_pool_arn" {
  value = aws_cognito_user_pool.user_pool.arn
}

# DNS-related
output "ns_records" {
  description = "Nameserver records for customer hosted zone"
  value       = [
    aws_route53_zone.zone.name_servers[0],
    aws_route53_zone.zone.name_servers[1],
    aws_route53_zone.zone.name_servers[2],
    aws_route53_zone.zone.name_servers[3],
  ]
}

output "hosted_zone_id" {
  description = "Subdomain hosted zone ID"
  value       = aws_route53_zone.zone.zone_id
}
