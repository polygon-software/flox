# Cognito configuration TODO: adapt based on flox.config

variable "project" {
  default         = "flox" # TODO: set based on .env?
  description     = "prefix used for all resources in the Project"
  type            = string
}

variable "mfa_configuration" {
  default         = "ON"              # Alternatives: 'OFF', 'OPTIONAL'
  description     = "Cognito MFA mode"
  type            = string
}

variable "auto_verified_attributes"{
  default         = ["email"]
  description     = "Cognito attributes to auto-verify"
  type            = set(string)
}

variable "username_attributes"{
  default         = ["email"]
  description     = "Cognito username attributes"
  type            = set(string)
}
