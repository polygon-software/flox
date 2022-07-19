// API Gateway entry
resource "aws_api_gateway_domain_name" "api_domain" {
  certificate_arn = var.backend_certificate_arn
  domain_name     = "api.${var.domain}"
}

// Route 53 A record pointing to API Gateway
resource "aws_route53_record" "api_record" {
  name                  = aws_api_gateway_domain_name.api_domain.domain_name
  type                  = "CNAME"
  zone_id               = var.hosted_zone_id
  alias {
    evaluate_target_health = false
    name                   = aws_lambda_function_url.api_lambda_url.function_url
    zone_id                = var.hosted_zone_id
  }
}
