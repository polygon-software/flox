# Variables to store in AWS SSM Parameter store

resource "aws_ssm_parameter" "hosted_zone_id" {
  name  = "${var.type}-hosted_zone_id"
  type  = "String"
  value = aws_route53_zone.zone.zone_id
}
