if [[ $1 != "live" ]] && [[ $1 != "test" ]]
then
  echo "Invalid deployment mode $1"
  exit
fi

# ==========================================
# ===  Step 0: Pre-setup (Cognito, DNS)  ===
# ==========================================

# Create flox.tfvars file from flox.config.json in frontend & backend
cd ../support || exit
zsh create-flox-tfvars.sh
echo "type=\"$1\"" >> flox.tfvars

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
sed -i -e "s/##TYPE##/$1/g" config.tf

# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/$project/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/$organisation/g" config.tf

if [[ $1 == "test" ]]
then
  url=$(jq '.general.test_base_domain' ../../backend/flox.config.json)
else
  url=$(jq '.general.live_base_domain' ../../backend/flox.config.json)
fi
url=${url:1:-1}

root_domain=$url

# In 'test' mode, extract root domain, since it will be owned by parent organization
# (e.g. flox.polygon-project.ch -> polygon-project.ch)
if [[ $1 == "test" ]]
then
  IFS='.' read -r pid root_domain <<< "$url" # split at first occurrence of '.', PID is project id, remains unused
fi

# Add domain config to flox.tfvars
echo "# ======== Domain Config ========" >> ../support/flox.tfvars
echo "base_domain=\"$url\"" >> ../support/flox.tfvars
echo "root_domain=\"$root_domain\"" >> ../support/flox.tfvars

# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/${project}/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/${organisation}/g" config.tf

# Apply Cognito Terraform
terraform init
terraform apply -auto-approve -var-file="../support/flox.tfvars"
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

# Generate frontend .env file from outputs
cd ../../frontend || exit
rm -f .env
echo "# ======== Frontend AWS variables ========" >> .env
echo "# This file is AUTOGENERATED - do not edit!" >> .env
echo "# ==========================================" >> .env
echo "VUE_APP_GRAPHQL_ENDPOINT=https://api.$url/graphql" >> .env
echo "VUE_APP_NAME=$project-$1" >> .env
echo "VUE_APP_AWS_REGION=$aws_region" >> .env
echo "VUE_APP_USER_POOL_ID=$user_pool_id" >> .env
echo "VUE_APP_USER_POOL_CLIENT_ID=$user_pool_client_id" >> .env

# ==========================================
# =====   Step 1: Parent DNS setup    ======
# =====  (Applies only in TEST mode)  ======
# ==========================================
if [[ $1 == "test" ]]
then
  cd ../scripts/1_parent-setup || exit

  # Replace 'TYPE' in config.tf with actual type (live, test)
  sed -i -e "s/##TYPE##/$1/g" config.tf

  # Replace 'PROJECT' in config.tf with actual project name
  sed -i -e "s/##PROJECT##/$project/g" config.tf

  # Replace 'ORGANISATION' in config.tf with actual organisation name
  sed -i -e "s/##ORGANISATION##/$organisation/g" config.tf

  # Apply Parent DNS Terraform
  terraform init
  terraform apply -auto-approve -var-file="../support/flox.tfvars"
fi

# ==========================================
# ======     Step 2: Main setup     ========
# ==========================================

cd ../2_main-setup || exit

# Replace 'TYPE' in config.tf with actual type (live, test)
sed -i -e "s/##TYPE##/$1/g" config.tf

# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/$project/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/$organisation/g" config.tf

# Build & zip frontend and backend
zsh ../support/build.bash "$1" "$project" "$build_mode"
cp ../outputs/frontend.zip frontend.zip
cp ../outputs/backend.zip backend.zip


# Apply main Terraform
terraform init
terraform apply -auto-approve -var-file="../support/flox.tfvars"

# ==========================================
# ======      Step 3: Cleanup       ========
# ==========================================

# Remove .zip files
rm -f ../2_main-setup/frontend.zip
rm -f ../2_main-setup/backend.zip

# Reset all config.tf files to their respective template files
cp ../0_pre-setup/config.tftemplate ../0_pre-setup/config.tf
cp ../1_parent-setup/config.tftemplate ../1_parent-setup/config.tf
cp ../2_main-setup/config.tftemplate ../2_main-setup/config.tf
