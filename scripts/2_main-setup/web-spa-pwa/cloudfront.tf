resource "aws_cloudfront_distribution" "website_distribution" {
  depends_on = [
    aws_s3_bucket.website_bucket
  ]

  origin {
    domain_name = aws_s3_bucket.website_bucket.bucket_regional_domain_name
    origin_id   = "s3-cloudfront"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases = [var.domain]

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "s3-cloudfront"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }
  price_class = "PriceClass_100"

  viewer_certificate {
    cloudfront_default_certificate = true
    acm_certificate_arn = aws_acm_certificate.frontend_cert.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }

}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "access-identity-${var.domain}.s3.amazonaws.com"
}
