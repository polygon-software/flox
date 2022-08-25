resource "aws_iam_role" "eb_web_role" {
  name = "aws-elasticbeanstalk-ec2-web-role-${var.type}"
  assume_role_policy = data.aws_iam_policy_document.eb_role_assume.json
}

resource "aws_iam_instance_profile" "web" {
  name = "web_profile-${var.type}"
  role = aws_iam_role.eb_web_role.name
}

resource "aws_iam_role_policy_attachment" "web_web_tier" {
  role   = aws_iam_role.eb_web_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

resource "aws_iam_role_policy_attachment" "web_multi_docker" {
  role   = aws_iam_role.eb_web_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker"
}

resource "aws_iam_role_policy_attachment" "web_worker_tier" {
  role       = aws_iam_role.eb_web_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier"
}

resource "aws_iam_role_policy_attachment" "web_ssm" {
  role   = aws_iam_role.eb_web_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

data aws_iam_policy_document eb_role_assume {
  statement {
    actions = ["sts:AssumeRole"]
    effect = "Allow"
    principals {
      type = "Service"
      identifiers = [ "ec2.amazonaws.com" ]
    }
  }
}
