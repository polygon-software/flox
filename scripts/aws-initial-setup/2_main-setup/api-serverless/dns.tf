resource "aws_route53_record" "api_record" {
  name                  = "api.${var.domain}"
  type                  = "CNAME"
  zone_id               = var.hosted_zone_id
  ttl                   = "300"
  records               = [aws_lambda_function_url.api_lambda_url.function_url]
}
