import * as frontendFloxConfig from '../../frontend/flox.config.json'
import * as backendFloxConfig from '../../backend/flox.config.json'

/**
 * This script is used for exporting all Flox configuration that is relevant to Terraform to a .tfvars file
 * Takes one parameter: 'live', 'test', 'stage' or 'dev'
 */

// Mode (live, test, stage or dev)
// @ts-ignore
const mode = process.argv[2]

console.log('# ======== Terraform Flox variables ========');
console.log('# This file is AUTOGENERATED - do not edit!');
console.log('# ==========================================');
console.log()

// Frontend infrastructure configuration
const frontendConfig = frontendFloxConfig.general
const authOptions = frontendFloxConfig.moduleOptions.auth

// Backend infrastructure configuration (mode-dependent)
const backendConfig = backendFloxConfig.general
const infrastructureConfig = backendFloxConfig[`infrastructure_${mode}`]

console.log('# ======== General Config options ========');
console.log(`project="${backendConfig.project}"`)
console.log(`aws_region="${infrastructureConfig.aws_region}"`)
console.log(`aws_s3_region="${infrastructureConfig.aws_s3_region}"`)
console.log(`serverless_api="${infrastructureConfig.serverless_api}"`)
console.log(`serverless_db="${infrastructureConfig.serverless_db}"`)
console.log(`serverless_db_version="${infrastructureConfig.serverless_db_version}"`)

console.log('# ======== Frontend Config options ========');
console.log(`frontend_build_mode="${frontendConfig[`mode_${mode}`]}"`)

console.log('# ======== Auth module options ========');
// 2FA settings
console.log(`mfa_configuration=${authOptions?.useTwoFactor ? '"ON"' : '"OFF"'}`)

// E-mail as username settings
console.log(`auto_verified_attributes=${authOptions?.emailAsUsername ? '["email"]' : '[]'}`)
console.log(`username_attributes=${authOptions?.emailAsUsername ? '["email"]' : '[]'}`)

console.log('# ======== Backend Config options ========');

console.log(`database_name="${backendConfig.database_name}"`)
console.log(`database_master_username="${backendConfig.database_master_username}"`)
