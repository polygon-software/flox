resource "aws_ses_domain_dkim" "ses_dkim" {
  domain = join("", aws_ses_domain_identity.ses_domain.*.domain)
}

resource "aws_route53_record" "ses_dkim_record" {
  count   = 3
  name    = "${element(aws_ses_domain_dkim.ses_dkim.dkim_tokens, count.index)}._domainkey"
  type    = "CNAME"
  ttl     = "600"
  zone_id = var.hosted_zone_id
  records = ["${element(aws_ses_domain_dkim.ses_dkim.dkim_tokens, count.index)}.dkim.amazonses.com"]
}

resource "aws_ses_domain_identity" "ses_domain" {
  domain     = var.domain
  depends_on = [aws_route53_record.ses_dkim_record]
}

resource "aws_ses_domain_identity_verification" "ses_domain_verification" {
  domain = aws_ses_domain_identity.ses_domain.id
}
