# ========================
# Creates tf.env file (Terraform environment variables) from
# .env and flox.config.js where relevant to Terraform variables
# ========================

echo "Creating tf.env from configurations..."

# Remove existing file (if any)
rm -f tf.env

# ===== Flox config variables =====

# Apply flox.config.js via helper .ts file
ts-node --compiler-options '{"module": "commonjs"}' ../../frontend/src/flox/export-variables.ts >> tf.env

echo "\n# ======== General project options ========"= >> tf.env

# ===== General variables =====

# Set project name as TF_VAR_project
echo -n TF_VAR_project= >> tf.env
cat ../../backend/.env | sed -n -e 's/^.*PROJECT_NAME=//p' >> tf.env

# Set database variables


# ===== Database variables =====

echo "\n# ======== Database options ========"= >> tf.env

# DB_NAME
echo -n TF_VAR_database_name= >> tf.env
cat ../../backend/.env | sed -n -e 's/^.*DB_DATABASE=//p' >> tf.env

# DB_USER
echo -n TF_VAR_database_master_username= >> tf.env
cat ../../backend/.env | sed -n -e 's/^.*DB_USER=//p' >> tf.env

# DB_USER_PASS
echo -n TF_VAR_database_master_password= >> tf.env
cat ../../backend/.env | sed -n -e 's/^.*DB_PASSWORD=//p' >> tf.env

echo "tf.env created successfully!"

