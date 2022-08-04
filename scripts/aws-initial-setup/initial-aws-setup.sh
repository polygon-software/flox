# --------------------------------------------------------------
# Sets up the initial infrastructure for a new Flox project on AWS.
# This script should only be ran once per mode!
# Takes two parameters:
# $1 - deployment mode: 'live', 'test' or 'dev'
# $2 - local mode (will perform cleanup): true or not set
# --------------------------------------------------------------
export TF_LOG=debug

if [[ $1 != "live" ]] && [[ $1 != "test" ]] && [[ $1 != "dev" ]]
then
  echo "Invalid deployment mode $1"
  exit
fi

# ==========================================
# ===  Step 0: Pre-setup (Cognito, DNS)  ===
# ==========================================

# Create flox.tfvars file from flox.config.json in frontend & backend
cd ../support || exit
bash create-flox-tfvars.sh "$1"
echo "type=\"$1\"" >> flox.tfvars

cd ../aws-initial-setup/0_pre-setup || exit

# Get additional flox.config variables
project=$(jq '.general.project' ../../../backend/flox.config.json)
project=${project:1:-1}

frontend_build_mode=$(jq ".general.mode_$1" ../../../frontend/flox.config.json)
frontend_build_mode=${frontend_build_mode:1:-1}

aws_region=$(jq ".infrastructure_$1.aws_region" ../../../backend/flox.config.json)
aws_region=${aws_region:1:-1}

organisation=$(jq '.general.organisation' ../../../backend/flox.config.json)
organisation=${organisation:1:-1}

# Serverless mode (API only)
serverless_api=$(jq ".infrastructure_$1.serverless_api" ../../../backend/flox.config.json)

# Replace 'TYPE' in config.tf with actual type (live, test or dev)
sed -i -e "s/##TYPE##/$1/g" config.tf

# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/$project/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/$organisation/g" config.tf

# Get mode-dependent base URL
if [[ $1 == "live" ]]
then
  url=$(jq ".general.live_domain" ../../../backend/flox.config.json)
  url=${url:1:-1}
else
  # E.g. test.flox.polygon-project.ch
  url="$1.$project.polygon-project.ch"
fi

# Add domain config to flox.tfvars
echo "# ======== Domain Config ========" >> ../../support/flox.tfvars
echo "domain=\"$url\"" >> ../../support/flox.tfvars

# Apply pre-setup Terraform (Cognito & hosted zone)
terraform init
terraform apply -auto-approve -var-file="../../support/flox.tfvars"
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
echo "ns_records=$ns_records" >> ../../support/flox.tfvars
echo "hosted_zone_id=\"$hosted_zone_id\"" >> ../../support/flox.tfvars

# Add Cognito outputs to flox.tfvars
echo "# ======== Cognito Config ========" >> ../../support/flox.tfvars
echo "cognito_arn=\"$user_pool_arn\"" >> ../../support/flox.tfvars
echo "user_pool_id=\"$user_pool_id\"" >> ../../support/flox.tfvars
echo "user_pool_client_id=\"$user_pool_client_id\"" >> ../../support/flox.tfvars

# Generate frontend .env file from outputs
cd ../../../frontend || exit
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
# ==      Step 1: Parent DNS setup        ==
# ==  (Applies only in TEST and DEV mode) ==
# ==========================================
if [[ $1 == "test" ]] || [[ $1 == "dev" ]]
then
  cd ../scripts/aws-initial-setup/1_parent-setup || exit

  # Replace 'TYPE' in config.tf with actual type (live, test)
  sed -i -e "s/##TYPE##/$1/g" config.tf

  # Replace 'PROJECT' in config.tf with actual project name
  sed -i -e "s/##PROJECT##/$project/g" config.tf

  # Replace 'ORGANISATION' in config.tf with actual organisation name
  sed -i -e "s/##ORGANISATION##/$organisation/g" config.tf

  # Apply Parent DNS Terraform
  terraform init
  terraform apply -auto-approve -var-file="../../support/flox.tfvars"
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

cd ../../support || exit

# Build & zip frontend and backend
if [[ $serverless_api == "true" ]]
then
  # Build in API & frontend in serverless mode for AWS lambda
  echo "Building for serverless deployment..."
  sudo bash build.sh "$project" "$frontend_build_mode" true
else
  # Regular build
  echo "Building for regular deployment..."
  sudo bash build.sh "$project" "$frontend_build_mode"
fi

cd ../aws-initial-setup/2_main-setup || exit

# Copy .zip files
cp ../../outputs/frontend.zip frontend.zip
cp ../../outputs/backend.zip backend.zip

# If non-ssr: unzip dist files for direct S3 upload
if [[ $frontend_build_mode != "ssr" ]]
then
  mkdir -p web-spa-pwa/frontend/
  unzip -q ./frontend -d web-spa-pwa/frontend/

  # Remove node_modules (if any)
  rm -rf web-spa-pwa/frontend/node_modules
fi

# Apply main Terraform
terraform init
terraform apply -auto-approve -var-file="../../support/flox.tfvars"

# ==========================================
# ======      Step 3: Cleanup       ========
# ======    (only in local mode)    ========
# ==========================================

if [[ $2 == 'true' ]]
then
  # Remove .zip files
  rm -f ../2_main-setup/frontend.zip
  rm -f ../2_main-setup/backend.zip

  # Remove unzipped frontend dist (if any)
  rm -rf ../2_main-setup/web-spa-pwa/frontend

  # Reset all config.tf files to their respective template files
  cp ../0_pre-setup/config.tftemplate ../0_pre-setup/config.tf
  cp ../1_parent-setup/config.tftemplate ../1_parent-setup/config.tf
  cp ../2_main-setup/config.tftemplate ../2_main-setup/config.tf

  # Quietly reinstall node modules
  cd ../../../backend || exit
  yarn install --silent 2> >(grep -v warning 1>&2)
  cd ../frontend || exit
  yarn install --silent 2> >(grep -v warning 1>&2)
fi
