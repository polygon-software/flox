// S3 bucket for uploading dist to
data "aws_s3_bucket" "website_bucket" {
  bucket = var.domain
}

// Delete existing files from bucket
resource "null_resource" "delete_files" {
  triggers = {
    timestamp = timestamp()
  }
  provisioner "local-exec" {
    command = <<EOF
export AWS_DEFAULT_REGION=${var.aws_region}
export AWS_ACCESS_KEY_ID="${var.aws_access_key}"
export AWS_SECRET_ACCESS_KEY="${var.aws_secret_access_key}"
aws s3 rm s3://${data.aws_s3_bucket.website_bucket.bucket} --recursive
EOF
  }
}
