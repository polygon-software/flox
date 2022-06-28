// Upload app.zip to bucket
resource "aws_s3_object" "frontend_source_code" {
  bucket                = aws_s3_bucket.source_code_bucket.id
  key                   = "${var.project}-${var.type}-web-beanstalk/frontend.zip"
  source                = "frontend.zip"
  source_hash           = filemd5("frontend.zip")
  tags = {
    Project       = var.project
  }
}

// Create Elastic Beanstalk resource
resource "aws_elastic_beanstalk_application" "frontend_application" {
  name                  = "${var.project}-${var.type}-web-app"
  description           = var.eb_app_desc
  tags = {
    Project       = var.project
  }
}

// Connect EBS to the S3 bucket containing the app
resource "aws_elastic_beanstalk_application_version" "frontend_application_version" {
  name                  = "${var.project}-${var.type}-web-v-v-${filemd5("frontend.zip")}"
  bucket                = aws_s3_bucket.source_code_bucket.id
  key                   = aws_s3_object.frontend_source_code.id
  application           = aws_elastic_beanstalk_application.frontend_application.name
  tags = {
    Project       = var.project
  }
}

// Create EBS environment
// For settings, see https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html
resource "aws_elastic_beanstalk_environment" "frontend_env" {
  name                  = "${var.project}-${var.type}-web-env"
  application           = aws_elastic_beanstalk_application.frontend_application.name
  solution_stack_name   = "64bit Amazon Linux 2 v5.5.4 running Node.js 14"
  description           = "Elastic Beanstalk Environment for the Quasar Frontend"
  version_label         = aws_elastic_beanstalk_application_version.frontend_application_version.name
  tags = {
    Project       = var.project
  }
  setting {
    namespace     = "aws:autoscaling:launchconfiguration"
    name          = "IamInstanceProfile"
    value         = aws_iam_instance_profile.web.name
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "LoadBalancerType"
    value     = "application"
  }

  setting {
    namespace     = "aws:ec2:vpc"
    name          = "VPCId"
    value         = aws_vpc.vpc.id
  }

  // Assign available (private) subnets to spawn EC2 instances within
  setting {
    namespace     = "aws:ec2:vpc"
    name          = "Subnets"
    value         = join(",", aws_subnet.frontend_private_subnet.*.id)
  }

  // Assign available (public) subnets to spawn the load-balancer within
  setting {
    namespace     = "aws:ec2:vpc"
    name          = "ELBSubnets"
    value         = join(",", aws_subnet.frontend_public_subnet.*.id)
  }
  setting {
    namespace     = "aws:autoscaling:launchconfiguration"
    name          = "InstanceType"
    value         = "t4g.small"
  }
  setting {
    namespace     = "aws:autoscaling:asg"
    name          = "MinSize"
    value         = 1
  }
  setting {
    namespace     = "aws:autoscaling:asg"
    name          = "MaxSize"
    value         = 6
  }
  setting {
    namespace     = "aws:elbv2:listener:443"
    name          = "Protocol"
    value         = "HTTPS"
  }
  setting {
    namespace     = "aws:elbv2:listener:443"
    name          = "SSLCertificateArns"
    value         = aws_acm_certificate_validation.cert_validation_frontend.certificate_arn
  }

  setting {
    name          = "ListenerEnabled"
    namespace     = "aws:elbv2:listener:default"
    value         = "true"
  }
}

data "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_elastic_beanstalk_environment.frontend_env.load_balancers[0]
  port              = 80
}

resource "aws_lb_listener_rule" "redirect_http_to_https" {
  listener_arn = data.aws_lb_listener.http_listener.arn
  priority = 1
  action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}
