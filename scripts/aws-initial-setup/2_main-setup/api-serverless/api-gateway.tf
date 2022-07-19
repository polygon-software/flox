resource "aws_apigatewayv2_api" "api_gateway" {
  name          = "${var.project}-${var.type}-api-gateway"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "api_gateway_integration" {
  api_id = aws_apigatewayv2_api.api_gateway.id

  integration_uri    = aws_lambda_function.api_lambda.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST" // TODO... GET and others?
}

// CloudWatch logging for API gateway
resource "aws_cloudwatch_log_group" "api_gateway_log_group" {
  name = "${var.project}-${var.type}-api-gateway"
  retention_in_days = 30
}

// API Gateway access to Lambda function
resource "aws_lambda_permission" "api_lambda_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.api_gateway.execution_arn}/*/*"
}

// API Gateway stage
resource "aws_apigatewayv2_stage" "api_gateway_lambda_stage" {
  api_id = aws_apigatewayv2_api.api_gateway.id

  name        = "${var.project}-${var.type}-api-gateway-stage"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway_log_group.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
    }
    )
  }
}

#resource "aws_apigatewayv2_route" "hello_world" {
#  api_id = aws_apigatewayv2_api.api_gateway.id
#
#  route_key = "GET /hello"
#  target    = "integrations/${aws_apigatewayv2_integration.hello_world.id}"
#}

#
