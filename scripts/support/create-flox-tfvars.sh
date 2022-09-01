# ========================
# Creates flox.tfvars file (Terraform environment variables) from
# .env and flox.config.json where relevant to Terraform variables
# Takes one parameter: 'live', 'test', 'stage' or 'dev'
# ========================

echo "Creating flox.tfvars from configurations for $1 mode..."

# Remove existing file (if any)
rm -f flox.tfvars

# ===== Flox config variables =====

# Install dependencies
yarn
yarn global add ts-node

# Apply flox.config.json via helper .ts file
ts-node --compiler-options '{"module": "commonjs"}' ./export-variables.ts "$1"  >> flox.tfvars

echo "flox.tfvars created successfully!"

