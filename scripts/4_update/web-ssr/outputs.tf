output "frontend_version" {
  description = "New EBS version number"
  value       = aws_elastic_beanstalk_application_version.frontend_application_version.name
}
