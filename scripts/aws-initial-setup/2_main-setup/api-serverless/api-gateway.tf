// TODO: this could be done with api gateway V2, maybe better?

resource "aws_api_gateway_rest_api" "api_gateway" {
  name          = "${var.project}-${var.type}-api-gateway"
  // Disable default execution endpoint, only accessed via custom domain
  disable_execute_api_endpoint = true
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  parent_id   = aws_api_gateway_rest_api.api_gateway.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.api_gateway.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "api_gateway_integration" {
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  resource_id = aws_api_gateway_method.proxy.resource_id
  http_method = aws_api_gateway_method.proxy.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_lambda.invoke_arn
}

// Handler for root-level requests
resource "aws_api_gateway_method" "proxy_root" {
  rest_api_id   = aws_api_gateway_rest_api.api_gateway.id
  resource_id   = aws_api_gateway_rest_api.api_gateway.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_root" {
  depends_on = [
    aws_api_gateway_method.proxy_root
  ]
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  resource_id = aws_api_gateway_method.proxy_root.resource_id
  http_method = aws_api_gateway_method.proxy_root.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_lambda.invoke_arn
}

// Actual public deployment
resource "aws_api_gateway_deployment" "api_gateway_deployment" {
  depends_on = [
    aws_api_gateway_integration.api_gateway_integration,
    aws_api_gateway_integration.lambda_root,
    aws_api_gateway_integration.options
  ]
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
}

// Deploy stage
resource "aws_api_gateway_stage" "api_stage" {
  deployment_id = aws_api_gateway_deployment.api_gateway_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.api_gateway.id
  stage_name    = var.type
}

// Access to Lambda function
resource "aws_lambda_permission" "api_lambda_access" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_rest_api.api_gateway.execution_arn}/*/*"
}

// API Gateway domain name
resource "aws_api_gateway_domain_name" "api_domain" {
  certificate_arn = var.backend_certificate_arn
  domain_name     = "api.${var.domain}"
}

// Link between API gateway and custom domain
resource "aws_api_gateway_base_path_mapping" "api_link" {
  api_id      = aws_api_gateway_rest_api.api_gateway.id
  stage_name  = aws_api_gateway_stage.api_stage.stage_name
  domain_name = aws_api_gateway_domain_name.api_domain.domain_name
}
