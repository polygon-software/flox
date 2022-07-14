# AWS Lambda deployment

// Lambda function using backend.zip
resource "aws_lambda_function" "api_lambda" {
  # If the file is not in the current working directory you will need to include a
  # path.module in the filename.
  filename      = var.api_source_code_object_id
  function_name = "${var.project}-${var.type}-api-lambda"
  role          = aws_iam_role.lambda_iam.arn
  # Lambda handler function location; since this is in src/lambda.ts -> handler(), we use AWS' lambda syntax below
  handler       = "src/lambda.handler"
  source_code_hash = var.api_source_code_object_hash

  runtime = "nodejs16.x"

  #TODO from .env file
  environment {
    variables = {
      foo = "bar"
    }
  }
}
