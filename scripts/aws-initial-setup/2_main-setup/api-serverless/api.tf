# AWS Lambda deployment

// Lambda function using backend.zip
resource "aws_lambda_function" "api_lambda" {
  function_name = "${var.project}-${var.type}-api-lambda"

  timeout     = 15
  s3_key      = var.api_source_code_object_key
  s3_bucket   = var.source_code_bucket_id
  role        = aws_iam_role.lambda_iam.arn
  memory_size = 512

  # Lambda handler function location; since this is in src/lambda.ts -> handler(), we use AWS' lambda syntax below
  handler       = "src/lambda.handler"
  source_code_hash = var.api_source_code_object_hash

  runtime = "nodejs16.x"

  vpc_config {
    security_group_ids = [aws_security_group.api_security_group.id]
    subnet_ids         = var.public_subnet_ids
  }
  // Env Variables for NestJS
  environment {
    variables = {
      // Database-related
      DB_DATABASE = var.database_name,
      DB_USER = var.database_master_username,
      DB_PASSWORD = var.database_master_password,
      DB_PORT = var.database_cluster_port,
      DB_HOST = var.database_cluster_endpoint,
      DATABASE_URL = "pg://${var.database_master_username}:${var.database_master_password}@${var.database_cluster_endpoint}:${var.database_cluster_port}/${var.database_name}",
      ENTITIES = "**/**.entity.js",

      // Ports
      SERVER_PORT = 3000
      NOCODB_PORT= 8000,

      // AWS
      AWS_PUBLIC_BUCKET_NAME = var.public_bucket_id,
      AWS_PRIVATE_BUCKET_NAME = var.private_bucket_id,
      COMPOSE_PROJECT_NAME = var.project,
      USER_POOL_ID= var.user_pool_id,
      USER_POOL_CLIENT_ID = var.user_pool_client_id,
      BASE_URL = "https://${var.domain}",
      "DEV" = "false",
      CLOUDWATCH_GROUP_NAME = "${var.project}-${var.type}",
      CLOUDWATCH_STREAM_NAME = "API",
      AWS_LOG_BUCKET_NAME = var.log_bucket_id
    }
  }
}

// Lambda function access URL
resource "aws_lambda_function_url" "api_lambda_url" {
  function_name      = aws_lambda_function.api_lambda.function_name
  authorization_type = "NONE" // No IAM authorization on lambda

  cors {
    allow_credentials = true
    allow_origins     = ["*"] // TODO: Restrict to frontend?
    allow_methods     = ["*"]
    allow_headers     = ["date", "keep-alive"]
    expose_headers    = ["keep-alive", "date"]
    max_age           = 86400
  }
}
