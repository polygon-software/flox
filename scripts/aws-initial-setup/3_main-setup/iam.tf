# IAM Roles setup
resource "aws_iam_role" "eb_api_role" {
  name = "aws-elasticbeanstalk-ec2-api-role-${var.type}"
  assume_role_policy = data.aws_iam_policy_document.eb_role_assume.json
}

resource "aws_iam_instance_profile" "api" {
  name = "api_profile-${var.type}"
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

resource "aws_iam_role_policy_attachment" "api_cloudwatch" {
  role   = aws_iam_role.eb_api_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}

resource "aws_iam_role_policy_attachment" "api_ses" {
  role   = aws_iam_role.eb_api_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSESFullAccess"
}

resource "aws_iam_role_policy_attachment" "api_ssm" {
  role   = aws_iam_role.eb_api_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "api_role" {
  role   = aws_iam_role.eb_api_role.name
  policy_arn = aws_iam_policy.iamPolicy.arn
}

resource "aws_iam_policy" "iamPolicy" {
  name = "${var.project}-manager-${var.type}"
  policy = data.aws_iam_policy_document.flox_manager_document.json
}

data aws_iam_policy_document flox_manager_document {
  statement {
    effect = "Allow"
    actions = [
      "cognito-idp:*",
    ]
    resources = [
      var.cognito_arn,
      "${var.cognito_arn}/*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "s3:*"
    ]
    resources = [
      aws_s3_bucket.private_files.arn,
      aws_s3_bucket.public_files.arn,
      aws_s3_bucket.log_files.arn,
      "${aws_s3_bucket.private_files.arn}/*",
      "${aws_s3_bucket.public_files.arn}/*",
      "${aws_s3_bucket.log_files.arn}/*",
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "sns:*"
    ]
    resources = ["*"]
  }
  statement {
    sid = "AllowKMSUse"
    effect = "Allow"
    actions = [
      "kms:Encrypt",
      "kms:Decrypt",
      "kms:ReEncrypt*",
      "kms:GenerateDataKey*",
      "kms:DescribeKey",
    ]
    resources = [
      aws_kms_key.s3_encryption_key.arn
    ]
  }
}

// Backend Admin User (full permissions on relevant systems)
resource "aws_iam_user" "backend_admin" {
  name      = "${var.project}-${var.type}-backend-admin"
}

// S3 Access
resource "aws_iam_user_policy_attachment" "backend_admin_s3" {
  user      = aws_iam_user.backend_admin.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}
// SES Access
resource "aws_iam_user_policy_attachment" "backend_admin_ses" {
  user      = aws_iam_user.backend_admin.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSESFullAccess"
}
// Cognito Access
resource "aws_iam_user_policy_attachment" "backend_admin_cognito" {
  user      = aws_iam_user.backend_admin.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonCognitoPowerUser"
}

// Programmatic access key
resource "aws_iam_access_key" "backend_admin_key" {
  user    = aws_iam_user.backend_admin.name
}

// Backup Creator User
resource "aws_iam_user" "backup_creator" {
  name      = "${var.project}-${var.type}-gcp-backup-manager"
}

# Policy
resource "aws_iam_policy" "backup_creator_policy" {
  name = "backup-creator-${var.type}"
  policy = data.aws_iam_policy_document.gcp_backup_creator_policy_document.json
}

# Policy Attachment
resource "aws_iam_user_policy_attachment" "backup_creator_policy_attachment" {
  policy_arn = aws_iam_policy.backup_creator_policy.arn
  user       = aws_iam_user.backup_creator.name
}

# Policy Document
data aws_iam_policy_document gcp_backup_creator_policy_document {
  statement {
    effect = "Allow"
    actions = [
      "s3:Get*",
      "s3:List*",
      "s3-object-lambda:Get*",
      "s3-object-lambda:List*"
    ]
    resources = [
      aws_s3_bucket.private_files.arn,
      aws_s3_bucket.public_files.arn,
      aws_s3_bucket.log_files.arn,
      "${aws_s3_bucket.private_files.arn}/*",
      "${aws_s3_bucket.public_files.arn}/*",
      "${aws_s3_bucket.log_files.arn}/*",
    ]
  }
  statement {
    sid = "AllowKMSUse"
    effect = "Allow"
    actions = [
      "kms:Encrypt",
      "kms:Decrypt",
      "kms:ReEncrypt*",
      "kms:GenerateDataKey*",
      "kms:DescribeKey",
    ]
    resources = [
      aws_kms_key.s3_encryption_key.arn
    ]
  }
  statement {
    effect = "Allow"
    actions = ["s3:ListAllMyBuckets"]
    resources = ["*"]
  }
}

data "aws_iam_policy_document" "log_bucket" {
  statement {
    sid = "CWLogs"
    effect = "Allow"
    actions = ["s3:PutObject"]
    principals {
      identifiers = ["logs.amazonaws.com"]
      type        = "Service"
    }
    resources = ["${aws_s3_bucket.log_files.arn}/*"]
  }
  statement {
    sid = "OrgAccounts"
    effect = "Allow"
    principals {
      identifiers = [aws_iam_role.log_exporter.arn]
      type        = "AWS"
    }
    actions = ["s3:PutObject"]
    resources = ["${aws_s3_bucket.log_files.arn}/*"]
  }
  statement {
    sid = "OrgAccountsAcl"
    effect = "Allow"
    principals {
      identifiers = [aws_iam_role.log_exporter.arn]
      type        = "AWS"
    }
    actions = [
      "s3:PutBucketAcl",
      "s3:GetBucketAcl"
    ]
    resources = [aws_s3_bucket.log_files.arn]
  }
  statement {
    sid = "CWLogsACL"
    effect = "Allow"
    actions = ["s3:GetBucketAcl"]
    principals {
      identifiers = ["logs.amazonaws.com"]
      type        = "Service"
    }
    resources = [aws_s3_bucket.log_files.arn]
  }
}

