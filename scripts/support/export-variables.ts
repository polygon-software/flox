import * as frontendAuth from '../../frontend/src/flox/modules/auth';
import * as frontendFloxConfig from '../../frontend/flox.config.json'
import * as backendFloxConfig from '../../backend/flox.config.json'
/**
 * This script is used for exporting all Flox configuration that is relevant to Terraform to a .tfvars file
 */

console.log('# ======== Terraform Flox variables ========');
console.log('# This file is AUTOGENERATED - do not edit!');
console.log('# ==========================================');
console.log()

const authOptions = frontendAuth.moduleConfig()


const frontendConfig = frontendFloxConfig.general
const backendConfig = backendFloxConfig.general

console.log('# ======== General Config options ========');
console.log(`aws_region="${backendConfig.aws_region}"`)

console.log('# ======== Frontend Config options ========');
console.log(`frontend_build_mode="${frontendConfig.mode}"`)

console.log('# ======== Auth module options ========');
// 2FA settings
console.log(`mfa_configuration=${authOptions?.useTwoFactor ? '"ON"' : '"OFF"'}`)

// E-mail as username settings
console.log(`auto_verified_attributes=${authOptions?.emailAsUsername ? '["email"]' : '[]'}`)
console.log(`username_attributes=${authOptions?.emailAsUsername ? '["email"]' : '[]'}`)

console.log('# ======== Backend Config options ========');

console.log(`database_name="${backendConfig.database_name}"`)
console.log(`database_master_username="${backendConfig.database_master_username}"`)