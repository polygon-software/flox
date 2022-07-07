# Get cloudfront URL & remove trailing '.'
output "cloudfront_url" {
  description = "Cloudfront URL"
  value       = aws_cloudfront_distribution.website_distribution.domain_name
}

output "cloudfront_zone_id" {
  description = "Cloudfront URL"
  value       = aws_cloudfront_distribution.website_distribution.hosted_zone_id
}
