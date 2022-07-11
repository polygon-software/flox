// New API version (applies only in SSR mode)
output "api_version" {
  value     = aws_elastic_beanstalk_application_version.api_app_version.name
}

// New Frontend version (applies only in SSR mode)
output "frontend_version" {
  value     = var.frontend_build_mode == "ssr" ? module.web_ssr[0].frontend_version : ""
}
