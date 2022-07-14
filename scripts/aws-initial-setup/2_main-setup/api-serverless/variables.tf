variable "type" {
  description     = "live or test"
  type            = string
}

variable "project" {
  default         = "flox"
  description     = "prefix used for all resources in the Project"
  type            = string
}

variable "domain" {
  description = "Project base domain, e.g. flox.polygon-project.ch"
  type    = string
}

variable "api_source_code_object_id" {
  description = "S3 source code .zip ID"
  type    = string
}

variable "api_source_code_object_hash" {
  description = "S3 source code object hash"
  type    = string
}
