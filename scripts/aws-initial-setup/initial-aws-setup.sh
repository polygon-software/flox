# --------------------------------------------------------------
# Sets up the initial infrastructure for a new Flox project on AWS.
# This script should only be ran once per mode!
# Takes two or four parameters:
# $1 - deployment mode: 'live', 'test', 'stage' or 'dev'
# $2 - local mode (will perform cleanup): true or not set
# $3 - (optional) - with third parameter set to 'true', will force redeployment
# $4 - (optional) - 'confirm' for forcing destruction
# even if the environment is already online
# If deployment is forced, user must enter 'confirm' as fourth parameter
# --------------------------------------------------------------

mode=$1
local_mode=$2
force_deployment=$3
confirm_force_deployment=$4

if [[ $mode != "live" ]] && [[ $mode != "test" ]] && [[ $mode != "stage" ]] && [[ $mode != "dev" ]]
then
  echo "Invalid deployment mode $mode"
  exit 1
fi

# ==========================================
# ===  Step 0: Pre-setup (Cognito, DNS)  ===
# ==========================================

# Create flox.tfvars file from flox.config.json in frontend & backend
cd ../support || exit
bash create-flox-tfvars.sh "$mode"

# If mode is stage, create branch name and save it to the GitHub action env file
if [[ $mode == "stage" ]]
then
  # The date will look like this: 160809 for the timestamp 16/08/2022 - 09:32:52
  branch_name="stage-$(date +'%d%m%H')"
  echo "{branch_name}={$branch_name}" >> "$GITHUB_ENV"
  echo "type=\"$branch_name\"" >> flox.tfvars
else
  echo "type=\"$mode\"" >> flox.tfvars
fi

cd ../aws-initial-setup/0_pre-setup || exit

# Get additional flox.config variables
project=$(jq '.general.project' ../../../backend/flox.config.json)
project=${project:1:-1}

frontend_build_mode=$(jq ".general.mode_$mode" ../../../frontend/flox.config.json)
frontend_build_mode=${frontend_build_mode:1:-1}

aws_region=$(jq ".infrastructure_$mode.aws_region" ../../../backend/flox.config.json)
aws_region=${aws_region:1:-1}

organisation=$(jq '.general.organisation' ../../../backend/flox.config.json)
organisation=${organisation:1:-1}

# Serverless mode (API only)
serverless_api=$(jq ".infrastructure_$mode.serverless_api" ../../../backend/flox.config.json)

# Replace 'TYPE' in config.tf with actual type (live, test, stage-xx or dev)
if [[ $mode == "stage" ]]
then
  sed -i -e "s/##TYPE##/$branch_name/g" config.tf
else
  sed -i -e "s/##TYPE##/$mode/g" config.tf
fi

# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/$project/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/$organisation/g" config.tf

# Get mode-dependent base URL
if [[ $mode == "live" ]]
then
  url=$(jq ".general.live_domain" ../../../backend/flox.config.json)
  url=${url:1:-1}
elif [[ $mode == "stage" ]];
then
  # Since there might be multiple staging infrastructures at the same time
  url="$branch_name.$project.polygon-project.ch"
else
  # E.g. test.flox.polygon-project.ch
  url="$mode.$project.polygon-project.ch"
fi

# Check whether selected deployment is already online
online_status=$(curl -s --head "https://$url" | grep '200')

if [[ ($online_status || $mode == "live" || $mode == "test") && ( $force_deployment != "true"  || $confirm_force_deployment != "confirm")]]
then
  echo "Deployment in mode $mode is already online or is customer-facing! Use 'force' to force deployment anyways (CAUTION: This may destroy existing infrastructure if configuration has changed!)."
  exit 1
fi

echo "=============================================="
echo "===  SETTING UP AWS INFRASTRUCTURE ($mode)  ==="
echo "=============================================="

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
echo "VUE_APP_NAME=$project-$mode" >> .env
echo "VUE_APP_AWS_REGION=$aws_region" >> .env
echo "VUE_APP_USER_POOL_ID=$user_pool_id" >> .env
echo "VUE_APP_USER_POOL_CLIENT_ID=$user_pool_client_id" >> .env

# Add production flag for actual live deployments so LogRocket is enabled
# (applies only to 'test' & 'live' system; building in production mode does
# NOT imply a production system where we need the logger to be active)
if [[ $mode == "live" ]] || [[ $mode == "test" ]]
then
  echo "VUE_APP_PRODUCTION=true" >> .env
else
    echo "VUE_APP_PRODUCTION=false" >> .env
fi

# ==========================================
# ==      Step 1: Parent DNS setup        ==
# ==  (Applies only in TEST and DEV mode) ==
# ==========================================
if [[ $mode == "test" ]] || [[ $mode == "dev" ]] || [[ $mode == "stage" ]]
then
  cd ../scripts/aws-initial-setup/1_parent-setup || exit

  # Replace 'TYPE' in config.tf with actual type (live, test, stage-xx or dev)
  if [[ $mode == "stage" ]]
  then
    sed -i -e "s/##TYPE##/$branch_name/g" config.tf
  else
    sed -i -e "s/##TYPE##/$mode/g" config.tf
  fi

  # Replace 'PROJECT' in config.tf with actual project name
  sed -i -e "s/##PROJECT##/$project/g" config.tf

  # Replace 'ORGANISATION' in config.tf with actual organisation name
  sed -i -e "s/##ORGANISATION##/$organisation/g" config.tf

  # Apply Parent DNS Terraform
  terraform init
  terraform apply -auto-approve -var-file="../../support/flox.tfvars"

  cd ../2_main-setup || exit
else
  cd ../scripts/aws-initial-setup/2_main-setup || exit
fi

# ==========================================
# ======     Step 2: Main setup     ========
# ==========================================

# Replace 'TYPE' in config.tf with actual type (live, test, stage-xx or dev)
if [[ $mode == "stage" ]]
then
  sed -i -e "s/##TYPE##/$branch_name/g" config.tf
else
  sed -i -e "s/##TYPE##/$mode/g" config.tf
fi

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

if [[ $local_mode == 'true' ]]
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
