variable "project" {
  description = "Project name"
  type = string
}

variable "type" {
  description     = "Deploy type; live, test, dev or stage-x"
  type = string
}

variable "source_code_bucket_id" {
  description     = "Source code bucket ID"
  type            = string
}
