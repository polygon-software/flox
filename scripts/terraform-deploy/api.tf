// upload app.zip to bucket
resource "aws_s3_bucket_object" "api_source_code_object" {
  bucket                = aws_s3_bucket.source_code_bucket.id
  key                   = "${var.project}-${var.type}-${var.api}-beanstalk/backend.zip"
  source                = "backend.zip"
  tags = {
    Project       = var.project
  }
}

// create elastic beanstalk resource
resource "aws_elastic_beanstalk_application" "api_app" {
  name                  = "${var.project}-${var.type}-${var.api}-app"
  description           = var.eb_app_desc
  tags = {
    Project       = var.project
  }
}

// connect eb to the s3 bucket with the app in it
resource "aws_elastic_beanstalk_application_version" "api_app_version" {
  bucket                = aws_s3_bucket.source_code_bucket.id
  key                   = aws_s3_bucket_object.api_source_code_object.id
  application           = aws_elastic_beanstalk_application.api_app.name
  name                  = "${var.project}-${var.type}-${var.api}-app-version-label"
  tags = {
    Project       = var.project
  }
}

// Create eb environment
// for settings see https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html
resource "aws_elastic_beanstalk_environment" "api_env" {
  name                  = "${var.project}-${var.type}-${var.api}-app-env"
  application           = aws_elastic_beanstalk_application.api_app.name
  solution_stack_name   = "64bit Amazon Linux 2 v5.4.10 running Node.js 14"
  description           = "Environment for api"
  version_label         = aws_elastic_beanstalk_application_version.api_app_version.name
  tags = {
    Project       = var.project
  }
  setting {
    namespace           = "aws:autoscaling:launchconfiguration"
    name                = "IamInstanceProfile"
    value               = "aws-elasticbeanstalk-ec2-role"
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
    namespace = "aws:elb:listener:443"
    name      = "ListenerProtocol"
    value     = "SSL"
  }

  setting {
    namespace = "aws:elb:listener:443"
    name      = "InstancePort"
    value     = 3000    // Port the NestJS API listens on
  }
  setting {
    namespace = "aws:elb:listener:443"
    name      = "InstanceProtocol"
    value     = "TCP"
  }
  setting {
    namespace = "aws:elb:listener:443"
    name      = "SSLCertificateId"
    value     = var.SSL_certificate_id
  }
  setting {
    name      = "ListenerEnabled"
    namespace = "aws:elb:listener:80"
    value     = "false"
  }
  setting {
    name      = "Application Healthcheck URL"
    namespace = "aws:elasticbeanstalk:application"
    value     = "TCP:3000"
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
    name      = "AWS_ACCESS_KEY_ID"
    value     = "AKIA5OA2ITKTNS52YK4I"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_SECRET_ACCESS_KEY"
    value     = "3EwzrvfBPB4Y9UdmVFcqkZn/wnBcabODmO6V/IB1"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_PUBLIC_BUCKET_NAME"
    value     = "soi-public-bucket-live"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_PRIVATE_BUCKET_NAME"
    value     = "soi-private-bucket-live"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "COMPOSE_PROJECT_NAME"
    value     = "soi"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "EMAIL_SENDER"
    value     = "soi@soi.polygon-project.ch"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_KEY_ID"
    value     = "AKIA5OA2ITKTAGYPDOMD"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_SECRET_KEY"
    value     = "eCQso0xoXLWDVFwCVa461hc6MhBcoJ5y73/6Bkzf"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "SES_REGION"
    value     = "eu-west-1"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "USER_POOL_ID"
    value     = "eu-central-1_Fx5YjVdhK"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "USER_POOL_CLIENT_ID"
    value     = "5h4fcam55ktksdcd0cskqidcsj"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "BASE_URL"
    value     = "https://soi-web.polygon-project.ch"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DEV"
    value     = "false"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "CLOUDWATCH_GROUP_NAME"
    value     = "SOI"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "CLOUDWATCH_STREAM_NAME"
    value     = "API"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "CW_ACCESS_KEY"
    value     = "AKIA5OA2ITKTLFLV5M7T"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "CV_KEY_SECRET"
    value     = "Udi2k9SWVyRg1P4wFxMA5sTeH9ngtRUVHBMWjIoK"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_LOG_BUCKET_NAME"
    value     = "soi-logs"
  }
}

resource "aws_security_group" "api_security_group" {
  name                  = "${var.project}-${var.type}-${var.api}-security-group"
  vpc_id                = aws_vpc.vpc.id
  tags = {
    Project       = var.project
  }
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