output "api_source_code_hash" {
  description = "Hash of new API source code version"
  value       = aws_s3_object.api_source_code_object.source_hash
}
