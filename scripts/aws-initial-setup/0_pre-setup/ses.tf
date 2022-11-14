data "aws_ses_domain_identity" "ses_domain" {
  domain = var.domain
}

resource "aws_ses_domain_mail_from" "ses_mail_from" {
  domain           = var.domain
  mail_from_domain = "mail.${var.domain}"
}

resource "aws_ses_domain_dkim" "ses_dkim" {
  domain = join("", data.aws_ses_domain_identity.ses_domain.*.domain)
}

resource "aws_route53_record" "ses_dkim_record" {
  count   = 3
  name    = "${element(aws_ses_domain_dkim.ses_dkim.dkim_tokens, count.index)}._domainkey"
  type    = "CNAME"
  ttl     = "600"
  zone_id = aws_route53_zone.zone.zone_id
  records = ["${element(aws_ses_domain_dkim.ses_dkim.dkim_tokens, count.index)}.dkim.amazonses.com"]
}

resource "aws_route53_record" "mail_from_tx" {
  zone_id = aws_route53_zone.zone.zone_id
  name    = aws_ses_domain_mail_from.ses_mail_from.mail_from_domain
  type    = "TXT"
  ttl     = "600"
  records = ["v=spf1 include:amazonses.com -all"]
}

resource "aws_route53_record" "mail_from_mx" {
  zone_id = aws_route53_zone.zone.zone_id
  name    = aws_ses_domain_mail_from.ses_mail_from.mail_from_domain
  type    = "MX"
  ttl     = "600"
  records = ["10 feedback-smtp.${var.aws_region}.amazonses.com"]
}

resource "aws_ses_domain_identity" "ses_domain" {
  domain      = var.domain
}