resource "aws_iam_role" "eb_api_role" {
  name = "aws-elasticbeanstalk-ec2-api-role"
  assume_role_policy = data.aws_iam_policy_document.eb_role_assume.json
}

resource "aws_iam_role" "eb_web_role" {
  name = "aws-elasticbeanstalk-ec2-web-role"
  assume_role_policy = data.aws_iam_policy_document.eb_role_assume.json
}

resource "aws_iam_instance_profile" "web" {
  name = "web_profile"
  role = aws_iam_role.eb_web_role.name
}
resource "aws_iam_instance_profile" "api" {
  name = "api_profile"
  role = aws_iam_role.eb_api_role.name
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



resource "aws_iam_role_policy_attachment" "api_web_tier" {
  role   = aws_iam_role.eb_api_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}
resource "aws_iam_role_policy_attachment" "api_multi_docker" {
  role   = aws_iam_role.eb_api_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker"
}
resource "aws_iam_role_policy_attachment" "api_worker_tier" {
  role   = aws_iam_role.eb_api_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier"
}
resource "aws_iam_role_policy_attachment" "api_ses" {
  role   = aws_iam_role.eb_api_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSESFullAccess"    // ToDo reduce
}
resource "aws_iam_role_policy_attachment" "api_soi" {
  role   = aws_iam_role.eb_api_role.name
  policy_arn = aws_iam_policy.soi.arn
}

resource "aws_iam_policy" "soi" {
  name = "soi-manager"
  policy = data.aws_iam_policy_document.soi_manager_document.json
}

data aws_iam_policy_document soi_manager_document {
  statement {
    effect = "Allow"
    actions = [
      "cognito-idp:*",
    ]
    resources = [aws_cognito_user_pool.user_pool.arn]
  }
  statement {
    effect = "Allow"
    actions = [
      "s3:*"
      ]
    resources = [
      aws_s3_bucket.private_files.arn,
      aws_s3_bucket.public_files.arn,
      "${aws_s3_bucket.private_files.arn}/*",
      "${aws_s3_bucket.public_files.arn}/*",
    ]
  }
}
