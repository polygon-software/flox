// Upload app.zip to bucket
resource "aws_s3_object" "api_source_code_object" {
  bucket                = aws_s3_bucket.source_code_bucket.id
  key                   = "${var.project}-${var.type}-api-beanstalk/backend.zip"
  source                = "backend.zip"
  source_hash           = filemd5("backend.zip")
}

// Create elastic beanstalk resource
resource "aws_elastic_beanstalk_application" "api_app" {
  name                  = "${var.project}-${var.type}-api-app"
  description           = var.eb_app_desc
}

// Connect eb to the s3 bucket with the app in it
resource "aws_elastic_beanstalk_application_version" "api_app_version" {
  bucket                = aws_s3_bucket.source_code_bucket.id
  key                   = aws_s3_object.api_source_code_object.id
  application           = aws_elastic_beanstalk_application.api_app.name
  name                  = "${var.project}-${var.type}-api-v-${filemd5("backend.zip")}"
}

// Create eb environment
// for settings see https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html
resource "aws_elastic_beanstalk_environment" "api_env" {
  name                  = "${var.project}-${var.type}-api-app-env"
  application           = aws_elastic_beanstalk_application.api_app.name
  solution_stack_name   = "64bit Amazon Linux 2 v5.5.4 running Node.js 14"
  description           = "Environment for API"
  version_label         = aws_elastic_beanstalk_application_version.api_app_version.name

  setting {
    namespace           = "aws:autoscaling:launchconfiguration"
    name                = "IamInstanceProfile"
    value               = aws_iam_instance_profile.api.name
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "LoadBalancerType"
    value     = "application"
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = aws_vpc.vpc.id
  }

  // Assign available (private) subnets to spawn EC2 instances within
  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", aws_subnet.frontend_private_subnet.*.id)
  }

  // Assign available (public) subnets to spawn the load-balancer within
  setting {
    namespace = "aws:ec2:vpc"
    name      = "ELBSubnets"
    value     = join(",", aws_subnet.frontend_public_subnet.*.id)
  }

  // Subnets of database
  setting {
    namespace = "aws:ec2:vpc"
    name      = "DBSubnets"
    value     = join(",", aws_subnet.database_subnets.*.id)
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t4g.micro"
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MinSize"
    value     = 1
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = 6
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.api_security_group.id
  }

  setting {
    namespace = "aws:elbv2:listener:443"
    name      = "Protocol"
    value     = "HTTPS"
  }

  setting {
    namespace = "aws:elbv2:listener:443"
    name      = "SSLCertificateArns"
    value     = aws_acm_certificate_validation.cert_validation_backend.certificate_arn
  }

  setting {
    name      = "ListenerEnabled"
    namespace = "aws:elbv2:listener:80"
    value     = "false"
  }

  setting {
    name      = "Port"
    namespace = "aws:elasticbeanstalk:environment:process:default"
    value     = 3000
  }

  setting {
    name      = "HealthCheckPath"
    namespace = "aws:elasticbeanstalk:environment:process:default"
    value     = "/healthcheck"
  }

  setting {
    name      = "StickinessEnabled"
    namespace = "aws:elasticbeanstalk:environment:process:default"
    value     = "true"
  }

  // Env Variables for NestJS
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "SERVER_PORT"
    value     = 3000
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_DATABASE"
    value     = aws_rds_cluster.database_cluster.database_name
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_USER"
    value     = aws_rds_cluster.database_cluster.master_username
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_PASSWORD"
    value     = aws_rds_cluster.database_cluster.master_password
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_PORT"
    value     = aws_rds_cluster.database_cluster.port
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_HOST"
    value     = aws_rds_cluster.database_cluster.endpoint
  }

  // Not yet implemented
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "NOCODB_PORT"
    value     = 8000
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "ENTITIES"
    value     = "**/**.entity.js"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DATABASE_URL"
    value     = "pg://${aws_rds_cluster.database_cluster.master_username}:${aws_rds_cluster.database_cluster.master_password}@${aws_rds_cluster.database_cluster.endpoint}:${aws_rds_cluster.database_cluster.port}/${aws_rds_cluster.database_cluster.database_name}"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_REGION"
    value     = var.aws_region
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_PUBLIC_BUCKET_NAME"
    value     = aws_s3_bucket.public_files.bucket
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_PRIVATE_BUCKET_NAME"
    value     = aws_s3_bucket.private_files.bucket
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "COMPOSE_PROJECT_NAME"
    value     = var.project
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "USER_POOL_ID"
    value     = var.user_pool_id
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "USER_POOL_CLIENT_ID"
    value     = var.user_pool_client_id
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "BASE_URL"
    value     = "https://${var.base_domain}"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DEV"
    value     = "false"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "CLOUDWATCH_GROUP_NAME"
    value     = "${var.project}-${var.type}"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "CLOUDWATCH_STREAM_NAME"
    value     = "API"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_LOG_BUCKET_NAME"
    value     = aws_s3_bucket.log_files.bucket
  }
}

resource "aws_security_group" "api_security_group" {
  name                  = "${var.project}-${var.type}-api-security-group"
  vpc_id                = aws_vpc.vpc.id

  ingress {
    from_port         = 3000
    protocol          = "TCP"
    to_port           = 3000
    cidr_blocks       = ["0.0.0.0/0"]
    ipv6_cidr_blocks  = ["::/0"]
  }
  egress {
    from_port         = 0
    to_port           = 0
    protocol          = "-1"
    cidr_blocks       = ["0.0.0.0/0"]
    ipv6_cidr_blocks  = ["::/0"]
  }
}
