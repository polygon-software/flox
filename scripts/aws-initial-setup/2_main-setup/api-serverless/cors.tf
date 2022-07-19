# OPTIONS HTTP method for CORS
resource "aws_api_gateway_method" "options" {
  depends_on = [
    aws_api_gateway_rest_api.api_gateway,
    aws_api_gateway_resource.proxy
  ]
  rest_api_id      = aws_api_gateway_rest_api.api_gateway.id
  resource_id      = aws_api_gateway_resource.proxy.id
  http_method      = "OPTIONS"
  authorization    = "NONE"
  api_key_required = false
}

// TODO all for root as well as proxy?

# OPTIONS method response
resource "aws_api_gateway_method_response" "options" {
  depends_on = [
    aws_api_gateway_rest_api.api_gateway,
    aws_api_gateway_resource.proxy,
    aws_api_gateway_method.options
  ]
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.options.http_method
  status_code = "200"
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

# OPTIONS integration
resource "aws_api_gateway_integration" "options" {
  depends_on = [
    aws_api_gateway_rest_api.api_gateway,
    aws_api_gateway_resource.proxy
  ]
  rest_api_id          = aws_api_gateway_rest_api.api_gateway.id
  resource_id          = aws_api_gateway_resource.proxy.id
  http_method          = "OPTIONS"
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" : "{\"statusCode\": 200}"
  }
}

# OPTIONS integration response
resource "aws_api_gateway_integration_response" "options" {
  depends_on = [
    aws_api_gateway_rest_api.api_gateway,
    aws_api_gateway_resource.proxy,
    aws_api_gateway_integration.options
  ]
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_integration.options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'" // TODO: only from var.domain
  }
}
