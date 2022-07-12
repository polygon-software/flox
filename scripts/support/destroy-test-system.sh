# --------------------------------------------------------------
# Destroys the TEST system
# Be careful: this script may destroy infrastructure seen by customers!
# --------------------------------------------------------------

# ==========================================
# ===  Step 0: Pre-setup (Cognito, DNS)  ===
# ==========================================

# Create flox.tfvars file from flox.config.json in frontend & backend
cd ../support || exit
zsh create-flox-tfvars.sh
echo "type=\"test\"" >> flox.tfvars

cd ../0_pre-setup || exit

# Get additional flox.config variables
project=$(jq '.general.project' ../../backend/flox.config.json)
project=${project:1:-1}

build_mode=$(jq '.general.mode' ../../frontend/flox.config.json)
build_mode=${build_mode:1:-1}

aws_region=$(jq '.general.aws_region' ../../backend/flox.config.json)
aws_region=${aws_region:1:-1}

organisation=$(jq '.general.organisation' ../../backend/flox.config.json)
organisation=${organisation:1:-1}

# Replace 'TYPE' in config.tf with actual type (live, test)
sed -i -e "s/##TYPE##/test/g" config.tf

# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/$project/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/$organisation/g" config.tf

url=$(jq '.general.test_base_domain' ../../backend/flox.config.json)
url=${url:1:-1}

root_domain=$url

# Extract root domain, since it will be owned by parent organization
# (e.g. flox.polygon-project.ch -> polygon-project.ch)
IFS='.' read -r pid root_domain <<< "$url" # split at first occurrence of '.', PID is project id, remains unused

# Add domain config to flox.tfvars
echo "# ======== Domain Config ========" >> ../support/flox.tfvars
echo "base_domain=\"$url\"" >> ../support/flox.tfvars
echo "root_domain=\"$root_domain\"" >> ../support/flox.tfvars

# Destroy Cognito via Terraform
terraform refresh -var-file="../support/flox.tfvars"
user_pool_id=$(terraform output user_pool_id)
user_pool_id=${user_pool_id:1:-1}

user_pool_client_id=$(terraform output user_pool_client_id)
user_pool_client_id=${user_pool_client_id:1:-1}

user_pool_arn=$(terraform output user_pool_arn)
user_pool_arn=${user_pool_arn:1:-1}

# Nameserver records for next step
ns_records=$(terraform output ns_records)

# Hosted zone ID for last step
hosted_zone_id=$(terraform output hosted_zone_id)
hosted_zone_id=${hosted_zone_id:1:-1}

# Add NS records & hosted zone ID to flox.tfvars
echo "ns_records=$ns_records" >> ../support/flox.tfvars
echo "hosted_zone_id=\"$hosted_zone_id\"" >> ../support/flox.tfvars

# Add Cognito outputs to flox.tfvars
echo "# ======== Cognito Config ========" >> ../support/flox.tfvars
echo "cognito_arn=\"$user_pool_arn\"" >> ../support/flox.tfvars
echo "user_pool_id=\"$user_pool_id\"" >> ../support/flox.tfvars
echo "user_pool_client_id=\"$user_pool_client_id\"" >> ../support/flox.tfvars

# ==========================================
# =====   Step 1: Parent DNS setup    ======
# =====  (Applies only in TEST mode)  ======
# ==========================================
cd ../1_parent-setup || exit

# Replace 'TYPE' in config.tf with actual type (live, test)
sed -i -e "s/##TYPE##/test/g" config.tf

# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/$project/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/$organisation/g" config.tf

# Destroy Parent DNS Terraform
terraform refresh -var-file="../support/flox.tfvars"

# ==========================================
# ======     Step 2: Main setup     ========
# ==========================================

cd ../2_main-setup || exit

# Replace 'TYPE' in config.tf with actual type (live, test)
sed -i -e "s/##TYPE##/test/g" config.tf

# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/$project/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/$organisation/g" config.tf

# Destroy main Terraform
terraform refresh -var-file="../support/flox.tfvars"


# Build & zip frontend and backend
zsh ../support/build.bash "test" "$project" "$build_mode"
cp ../outputs/frontend.zip frontend.zip
cp ../outputs/backend.zip backend.zip

# ==========================================
# ======    Step 3: Destroy all     ========
# ==========================================

terraform destroy -auto-approve -var-file="../support/flox.tfvars"
cd ../1_parent-setup || exit
terraform destroy -auto-approve -var-file="../support/flox.tfvars"
cd ../0_pre-setup || exit
terraform destroy -auto-approve -var-file="../support/flox.tfvars"

# ==========================================
# ======      Step 4: Cleanup       ========
# ==========================================

# Remove .zip files
rm -f ../2_main-setup/frontend.zip
rm -f ../2_main-setup/backend.zip

# Reset all config.tf files to their respective template files
cp ../0_pre-setup/config.tftemplate ../0_pre-setup/config.tf
cp ../1_parent-setup/config.tftemplate ../1_parent-setup/config.tf
cp ../2_main-setup/config.tftemplate ../2_main-setup/config.tf

# TODO: S3 destroy fails if bucket is not empty!
