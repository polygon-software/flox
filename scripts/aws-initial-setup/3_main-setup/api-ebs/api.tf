
// Create Elastic Beanstalk resource
resource "aws_elastic_beanstalk_application" "api_app" {
  name                  = "${var.project}-${var.type}-api-app"
  description           = var.eb_app_desc
}

// Connect EBS to the S3 bucket with the app in it
resource "aws_elastic_beanstalk_application_version" "api_app_version" {
  bucket                = var.source_code_bucket_id
  key                   = var.api_source_code_object_id
  application           = aws_elastic_beanstalk_application.api_app.name
  name                  = "${var.project}-${var.type}-api-v-${var.api_source_code_object_hash}"
}

// Create EBS environment
// for settings see https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html
resource "aws_elastic_beanstalk_environment" "api_env" {
  name                  = "${var.project}-${var.type}-api-app-env"
  application           = aws_elastic_beanstalk_application.api_app.name
  solution_stack_name   = "64bit Amazon Linux 2 v5.6.3 running Node.js 16"
  description           = "Environment for API"
  # Version override (used for update workflow)
  version_label         = aws_elastic_beanstalk_application_version.api_app_version.name

  setting {
    namespace           = "aws:autoscaling:launchconfiguration"
    name                = "IamInstanceProfile"
    value               = var.api_iam_instance_profile_name
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "LoadBalancerType"
    value     = "application"
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = var.vpc_id
  }

  // Assign available (private) subnets to spawn EC2 instances within
  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", var.private_subnet_ids)
  }

  // Assign available (public) subnets to spawn the load-balancer within
  setting {
    namespace = "aws:ec2:vpc"
    name      = "ELBSubnets"
    value     = join(",", var.public_subnet_ids)
  }

  // Subnets of database
  setting {
    namespace = "aws:ec2:vpc"
    name      = "DBSubnets"
    value     = join(",", var.database_subnet_ids)
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
    value     = var.api_security_group_id
  }

  setting {
    namespace = "aws:elbv2:listener:443"
    name      = "Protocol"
    value     = "HTTPS"
  }

  setting {
    namespace = "aws:elbv2:listener:443"
    name      = "SSLCertificateArns"
    value     = var.backend_certificate_arn
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
    value     = var.database_name
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_USER"
    value     = var.database_master_username
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_PASSWORD"
    value     = var.database_master_password
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_PORT"
    value     = var.database_cluster_port
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_HOST"
    value     = var.database_cluster_endpoint
  }

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
    value     = "pg://${var.database_master_username}:${var.database_master_password}@${var.database_cluster_endpoint}:${var.database_cluster_port}/${var.database_name}"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_MAIN_REGION"
    value     = var.aws_region
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_PUBLIC_BUCKET_NAME"
    value     = var.public_bucket_id
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_PRIVATE_BUCKET_NAME"
    value     = var.private_bucket_id
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "PROJECT_NAME"
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
    value     = "https://${var.domain}"
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
    value     = var.log_bucket_id
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "SERVERLESS"
    value     = false
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_ADMIN_ACCESS_KEY_ID"
    value     = var.admin_key_id
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_ADMIN_SECRET_ACCESS_KEY"
    value     = var.admin_key_secret
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "STRIPE_SECRET_KEY"
    value     = var.stripe_secret_key
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "ERP_API_USERNAME"
    value     = var.ERP_API_USERNAME
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "ERP_API_PASSWORD"
    value     = var.ERP_API_PASSWORD
  }
}
