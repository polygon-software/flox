#resource "aws_route53_record" "www" {
#  zone_id = var.hosted_zone_id
#  name = var.domain
#  type = "A"
#  alias {
#    name = aws_s3_bucket.website_bucket.website_domain
#    zone_id = aws_s3_bucket.website_bucket.hosted_zone_id
#    evaluate_target_health = false
#  }
#}
