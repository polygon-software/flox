output "backend_certificate_arn" {
  description = "ARN of the (us-east-1 located) backend SSL certificate"
  value       = aws_acm_certificate.backend_cert.arn
}
