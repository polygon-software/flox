// upload app.zip to bucket
resource "aws_s3_bucket_object" "frontend_source_code" {
  bucket                = aws_s3_bucket.source_code_bucket.id
  key                   = "${var.project}-${var.type}-${var.web}-beanstalk/frontend.zip"
  source                = "frontend.zip"
  tags = {
    Project       = var.project
  }
}

// create elastic beanstalk resource
resource "aws_elastic_beanstalk_application" "frontend_application" {
  name                  = "${var.project}-${var.type}-${var.web}-app"
  description           = var.eb_app_desc
  tags = {
    Project       = var.project
  }
}

// connect eb to the s3 bucket with the app in it
resource "aws_elastic_beanstalk_application_version" "frontend_application_version" {
  name                  = "${var.project}-${var.type}-${var.web}-app-version"
  bucket                = aws_s3_bucket.source_code_bucket.id
  key                   = aws_s3_bucket_object.frontend_source_code.id
  application           = aws_elastic_beanstalk_application.frontend_application.name
  tags = {
    Project       = var.project
  }
}

// Create eb environment
// for settings see https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html
resource "aws_elastic_beanstalk_environment" "frontend_env" {
  name                  = "${var.project}-${var.type}-${var.web}-env"
  application           = aws_elastic_beanstalk_application.frontend_application.name
  solution_stack_name   = "64bit Amazon Linux 2 v5.4.10 running Node.js 14"
  description           = "Elastic Beanstalk Environment for the Quasar Frontend"
  version_label         = aws_elastic_beanstalk_application_version.frontend_application_version.name
  tags = {
    Project       = var.project
  }
  setting {
    namespace     = "aws:autoscaling:launchconfiguration"
    name          = "IamInstanceProfile"
    value         = "aws-elasticbeanstalk-ec2-role"
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
    namespace     = "aws:elb:listener:443"
    name          = "ListenerProtocol"
    value         = "TCP"
  }
  setting {
    namespace     = "aws:elb:listener:443"
    name          = "InstancePort"
    value         = 8080    // The Port Quasar listens on
  }
  setting {
    namespace     = "aws:elb:listener:443"
    name          = "InstanceProtocol"
    value         = "TCP"
  }
  setting {
    namespace     = "aws:elb:listener:443"
    name          = "SSLCertificateId"
    value         = var.SSL_certificate_id
  }
  setting {
    name          = "ListenerEnabled"
    namespace     = "aws:elb:listener:80"
    value         = "false"
  }
  setting {
    name          = "Application Healthcheck URL"
    namespace     = "aws:elasticbeanstalk:application"
    value         = "TCP:8080"
  }
}
