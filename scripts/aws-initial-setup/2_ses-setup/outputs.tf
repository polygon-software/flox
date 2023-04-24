# User Pool
output "ses_domain_arn" {
  value = aws_ses_domain_identity.ses_domain.arn
}
