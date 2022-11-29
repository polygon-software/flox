// Route 53 A record pointing to API Gateway
resource "aws_route53_record" "api_record" {
  name                  = "api.${var.domain}"
  type                  = "A"
  zone_id               = var.hosted_zone_id
  alias {
    evaluate_target_health = false
    name                   = aws_api_gateway_domain_name.api_domain.cloudfront_domain_name
    zone_id                = aws_api_gateway_domain_name.api_domain.cloudfront_zone_id
  }
}
