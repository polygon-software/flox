// upload app.zip to bucket
resource "aws_s3_bucket_object" "api_tf_bucket_obj" {
  bucket = aws_s3_bucket.tf_app_bucket.id
  key = "${var.project_prefix_char}-${var.api}-beanstalk/backend.zip"
  source = "backend.zip"
}

// create elastic beanstalk resource
resource "aws_elastic_beanstalk_application" "api_tf_eb_app" {
  name  = "${var.project_prefix_char}-${var.api}-app"
  description = var.eb_app_desc
}

// connect eb to the s3 bucket with the app in it
resource "aws_elastic_beanstalk_application_version" "api_eb_app_ver" {
  bucket = aws_s3_bucket.tf_app_bucket.id
  key = aws_s3_bucket_object.api_tf_bucket_obj.id
  application = aws_elastic_beanstalk_application.api_tf_eb_app.name
  name = "${var.project_prefix_char}-${var.api}-app-version-label"
}

// Create eb environment
// for settings see https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html
resource "aws_elastic_beanstalk_environment" "api_eb_env" {

  name = "${var.project_prefix_char}-${var.api}-app-env"
  application = aws_elastic_beanstalk_application.api_tf_eb_app.name
  solution_stack_name = "64bit Amazon Linux 2 v5.4.10 running Node.js 14"
  description = "environment for api"
  version_label = aws_elastic_beanstalk_application_version.api_eb_app_ver.name


  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name = "IamInstanceProfile"
    value = "aws-elasticbeanstalk-ec2-role"
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = aws_vpc.tf_eb_vpc.id
  }

  // Assign available (private) subnets to spawn EC2 instances within
  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", aws_subnet.web_pri_subnet.*.id)
  }

  // Assign available (public) subnets to spawn the load-balancer within
  setting {
    namespace = "aws:ec2:vpc"
    name      = "ELBSubnets"
    value     = join(",", aws_subnet.web_pub_subnet.*.id)
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "DBSubnets"
    value     = join(",", aws_subnet.tf_db_subnet.*.id)
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
    value     = aws_security_group.API-Security-Group.id
  }
  setting {
    namespace = "aws:elb:listener:3000"
    name      = "ListenerProtocol"
    value     = "TCP"
  }
  setting {
    namespace = "aws:elb:listener:3000"
    name      = "InstancePort"
    value     = 3000
  }
  setting {
    namespace = "aws:elb:listener:3000"
    name      = "InstanceProtocol"
    value     = "TCP"
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

  // Env Variables
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "SERVER_PORT"
    value     = 3000
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_DATABASE"
    value     = aws_rds_cluster.tf_db_cluster.database_name
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_USER"
    value     = aws_rds_cluster.tf_db_cluster.master_username
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_PASSWORD"
    value     = aws_rds_cluster.tf_db_cluster.master_password
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_PORT"
    value     = aws_rds_cluster.tf_db_cluster.port
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_HOST"
    value     = aws_rds_cluster.tf_db_cluster.endpoint
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
    value     = "pg://${aws_rds_cluster.tf_db_cluster.master_username}:${aws_rds_cluster.tf_db_cluster.master_password}@${aws_rds_cluster.tf_db_cluster.endpoint}:${aws_rds_cluster.tf_db_cluster.port}/${aws_rds_cluster.tf_db_cluster.database_name}"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_REGION"
    value     = "eu-central-1"
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
    value     = "info@soi-ag.ch"
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
    value     = "http://soi-web.polygon-project.ch"
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

resource "aws_security_group" "API-Security-Group" {
  name = "soi-api-security-group"
  vpc_id = aws_vpc.tf_eb_vpc.id
  ingress {
    from_port = 3000
    protocol  = "TCP"
    to_port   = 3000
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}
