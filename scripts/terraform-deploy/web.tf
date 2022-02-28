// upload app.zip to bucket
resource "aws_s3_bucket_object" "web_tf_bucket_obj" {
  bucket = aws_s3_bucket.tf_app_bucket.id
  key = "${var.project_prefix_char}-${var.web}-beanstalk/frontend.zip"
  source = "frontend.zip"
}

// create elastic beanstalk resource
resource "aws_elastic_beanstalk_application" "web_tf_eb_app" {
  name  = "${var.project_prefix_char}-${var.web}-app"
  description = var.eb_app_desc
}

// connect eb to the s3 bucket with the app in it
resource "aws_elastic_beanstalk_application_version" "web_eb_app_ver" {
  bucket = aws_s3_bucket.tf_app_bucket.id
  key = aws_s3_bucket_object.web_tf_bucket_obj.id
  application = aws_elastic_beanstalk_application.web_tf_eb_app.name
  name = "${var.project_prefix_char}-${var.web}-app-version-label-11"
}

// Create eb environment
// for settings see https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html
resource "aws_elastic_beanstalk_environment" "web_eb_env" {

  name = "${var.project_prefix_char}-${var.web}-app-env"
  application = aws_elastic_beanstalk_application.web_tf_eb_app.name
  solution_stack_name = "64bit Amazon Linux 2 v5.4.10 running Node.js 14"
  description = "environment for web"
  version_label = aws_elastic_beanstalk_application_version.web_eb_app_ver.name


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
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t4g.small"
  }

  /*  setting {
      namespace = "aws:elasticbeanstalk:environment"
      name      = "LoadBalancerType"
      value     = "application"
    }*/

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
}
