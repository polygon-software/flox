# ========================
# Creates tf.env file (Terraform environment variables) from
# .env and flox.config.js where relevant to Terraform variables
# ========================

# Remove existing file (if any)
rm -f tf.env

# Apply flox.config.js via helper .ts file
ts-node --compiler-options '{"module": "commonjs"}' ../../frontend/src/flox/export-variables.ts >> tf.env

# Set project name as TF_VAR_project
echo -n TF_VAR_project= >> tf.env
cat ../../backend/.env | sed -n -e 's/^.*PROJECT_NAME=//p' >> tf.env
echo "Completed!"

# TODO export all vars
