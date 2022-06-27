# ========================
# Creates flox.tfvars file (Terraform environment variables) from
# .env and flox.config.js where relevant to Terraform variables
# ========================

echo "Creating flox.tfvars from configurations..."

# Remove existing file (if any)
rm -f flox.tfvars

# ===== Flox config variables =====

# Apply flox.config.js via helper .ts file
ts-node --compiler-options '{"module": "commonjs"}' ./export-variables.ts  >> flox.tfvars


echo "flox.tfvars created successfully!"

