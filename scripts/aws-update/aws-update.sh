# --------------------------------------------------------------
# Updates existing AWS infrastructure without recreating everything
# Takes two or three parameters:
# $1 - deployment mode: 'live', 'test', 'dev' or 'stage'
# $2 - local mode (will perform cleanup): true or not set
# $3 - (optional) - staging branch name (e.g. stage-123412)
# --------------------------------------------------------------

mode=$1
local_mode=$2
staging_branch_name=$3

if [[ $mode != "live" ]] && [[ $mode != "test" ]]  && [[ $mode != "dev" ]] && [[ $mode != "stage" ]]
then
  echo "Invalid deployment mode $mode"
  exit 1
fi

REGEX_STAGE="^stage-[0-9]{6}$"
if [[ $mode == "stage" ]] && [[ ! $staging_branch_name =~ $REGEX_STAGE ]]
then
  echo "Invalid staging branch name $staging_branch_name"
  exit 1
fi

# ==========================================
# ===  Step 0: Preparation (get params)  ===
# ==========================================

# Create flox.tfvars file from flox.config.json in frontend & backend
cd ../support || exit
bash create-flox-tfvars.sh "$mode"

if [[ $mode == "stage" ]]
then
  echo "type=\"$staging_branch_name\"" >> flox.tfvars
else
  echo "type=\"$mode\"" >> flox.tfvars
fi

# Add TF API token (given from .env) to flox.tfvars
echo "tf_api_token=\"$TF_API_TOKEN\"" >> flox.tfvars

# Get additional flox.config variables
project=$(jq '.general.project' ../../backend/flox.config.json)
project=${project:1:-1}

frontend_build_mode=$(jq ".general.mode_$mode" ../../frontend/flox.config.json)
frontend_build_mode=${frontend_build_mode:1:-1}

aws_region=$(jq ".infrastructure_$mode.aws_region" ../../backend/flox.config.json)
aws_region=${aws_region:1:-1}

organisation=$(jq '.general.organisation' ../../backend/flox.config.json)
organisation=${organisation:1:-1}

# Serverless mode (API only)
serverless_api=$(jq ".infrastructure_$mode.serverless_api" ../../backend/flox.config.json)

# Get mode-dependent base URL
if [[ $mode == "live" ]]
then
  url=$(jq ".general.live_domain" ../../backend/flox.config.json)
  url=${url:1:-1}
else
  if [[ $mode == "stage" ]]
  then
    # E.g. stage-123412.flox.polygon-project.ch
    url="$staging_branch_name.$project.polygon-project.ch"
  else
    # E.g. test.flox.polygon-project.ch
    url="$mode.$project.polygon-project.ch"
  fi
fi

# Check online status
online_status=$(curl -s --head "https://$url" | grep '200')

# If deployment is not currently online, don't continue with update
if [[ ! $online_status ]]
then
  echo "Deployment in mode '$mode' is not online at URL: $url!"
  exit 1
fi


# Go to pre-update folder
cd ../aws-update/0_pre-update || exit

# Replace 'TYPE' in config.tf with actual type (live, test, stage-123412 or dev)
if [[ $mode == "stage" ]]
then
    sed -i -e "s/##TYPE##/$staging_branch_name/g" config.tf
else
    sed -i -e "s/##TYPE##/$mode/g" config.tf
fi

# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/$project/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/$organisation/g" config.tf

# Add Domain to flox.tfvars
echo "# ======== Domain Config ========" >> ../../support/flox.tfvars
echo "domain=\"$url\"" >> ../../support/flox.tfvars

# Apply pre-update terraform for getting SSM parameters
terraform init
terraform apply -auto-approve -var-file="../../support/flox.tfvars"

# Get variables from outputs
user_pool_id=$(terraform output user_pool_id)
user_pool_id=${user_pool_id:1:-1}

user_pool_client_id=$(terraform output user_pool_client_id)
user_pool_client_id=${user_pool_client_id:1:-1}

source_code_bucket=$(terraform output source_code_bucket)
source_code_bucket=${source_code_bucket:1:-1}

cognito_arn=$(terraform output cognito_arn)
cognito_arn=${cognito_arn:1:-1}

hosted_zone_id=$(terraform output hosted_zone_id)
hosted_zone_id=${hosted_zone_id:1:-1}

# Add hosted zone & Cognito outputs to flox.tfvars
echo "hosted_zone_id=\"$hosted_zone_id\"" >> ../../support/flox.tfvars
echo "# ======== Cognito Config ========" >> ../../support/flox.tfvars
echo "user_pool_id=\"$user_pool_id\"" >> ../../support/flox.tfvars
echo "user_pool_client_id=\"$user_pool_client_id\"" >> ../../support/flox.tfvars
echo "cognito_arn=\"$cognito_arn\"" >> ../../support/flox.tfvars
echo "# ======== S3 Config ========" >> ../../support/flox.tfvars
echo "source_code_bucket=\"$source_code_bucket\"" >> ../../support/flox.tfvars

# ==========================================
# ====       Step 1: Main Update        ====
# ==========================================

# Generate frontend .env file from outputs
cd ../../../frontend || exit
rm -f .env
echo "# ======== Frontend AWS variables ========" >> .env
echo "# This file is AUTOGENERATED - do not edit!" >> .env
echo "# ==========================================" >> .env
echo "VUE_APP_BACKEND_URL=https://api.$url" >> .env
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

# Go to update folder
cd ../scripts/aws-update/1_update || exit

# Replace 'TYPE' in config.tf with actual type (live, test, stage-123412 or dev)
if [[ $mode == "stage" ]]
then
    sed -i -e "s/##TYPE##/$staging_branch_name/g" config.tf
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
  # Build in serverless mode for AWS lambda
  echo "Building for serverless deployment..."
  sudo bash build.sh "$project" "$frontend_build_mode" true
else
  # Regular build
  echo "Building for regular deployment..."
  sudo bash build.sh "$project" "$frontend_build_mode"
fi

cd ../aws-update/1_update || exit

cp ../../outputs/frontend.zip frontend.zip
cp ../../outputs/backend.zip backend.zip

# If non-ssr: unzip dist files for direct S3 upload
if [[ $frontend_build_mode != "ssr" ]]
then
  mkdir -p web-spa-pwa/frontend/
  unzip -q ../../outputs/frontend -d web-spa-pwa/frontend/

  # Remove node_modules (if any)
  rm -rf web-spa-pwa/frontend/node_modules
fi

# Apply update Terraform
terraform init
terraform apply -auto-approve -var-file="../../support/flox.tfvars"

# ==========================================
# ====    Step 2: Resource re-deploy   =====
# ==========================================

# Go to main Terraform workspace to re-apply Terraform (since EBS Env state is held there)
cd ../../aws-initial-setup/4_main-setup || exit

# Copy .zips, so terraform can handle resources
cp ../../outputs/frontend.zip frontend.zip
cp ../../outputs/backend.zip backend.zip

# Replace 'TYPE' in config.tf with actual type (live, test, stage-123412 or dev)
if [[ $mode == "stage" ]]
then
    sed -i -e "s/##TYPE##/$staging_branch_name/g" config.tf
else
    sed -i -e "s/##TYPE##/$mode/g" config.tf
fi

# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/$project/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/$organisation/g" config.tf

terraform init

if [[ $frontend_build_mode != "ssr" ]]
then
  if [[ $serverless_api == true ]]
  then
    # In serverless API mode, also renew lambda
    terraform apply -target="module.web_spa_pwa[0].null_resource.cache_invalidation" -target="module.api_serverless[0].aws_lambda_function.api_lambda" -auto-approve -var-file="../../support/flox.tfvars"
  else
    terraform apply -target="module.web_spa_pwa[0].null_resource.cache_invalidation" -target="module.api_ebs[0].aws_elastic_beanstalk_environment.api_env" -auto-approve -var-file="../../support/flox.tfvars"
  fi
# For SSR mode, also redeploy SSR frontend
else
  if [[ $serverless_api == true ]]
    then
      # In serverless API mode, also renew lambda
      terraform apply -target="module.web_ssr[0].aws_elastic_beanstalk_environment.frontend_env" -target="module.api_serverless[0].aws_lambda_function.api_lambda" -auto-approve -var-file="../../support/flox.tfvars"
    else
      terraform apply -target="module.api_ebs[0].aws_elastic_beanstalk_environment.api_env" -target="module.web_ssr[0].aws_elastic_beanstalk_environment.frontend_env" -auto-approve -var-file="../../support/flox.tfvars"
    fi
fi

# ==========================================
# ======      Step 3: Cleanup       ========
# ======    (only in local mode)    ========
# ==========================================

if [[ $local_mode == 'true' ]]
then
  # Remove .zip files
  rm -f ../../aws-update/1_update/frontend.zip
  rm -f ../../aws-update/1_update/backend.zip
  rm -f frontend.zip
  rm -f backend.zip

  # Remove unzipped frontend dist (if any)
  rm -rf ../../aws-update/1_update/web-spa-pwa/frontend

  # Reset config.tf file to its respective template files
  cp config.tftemplate config.tf
  cp ../../aws-update/0_pre-update/config.tftemplate ../../aws-update/0_pre-update/config.tf
  cp ../../aws-update/1_update/config.tftemplate ../../aws-update/1_update/config.tf

  # Quietly reinstall node modules
  cd ../../../backend || exit
  yarn install --silent 2> >(grep -v warning 1>&2)
  cd ../frontend || exit
  yarn install --silent 2> >(grep -v warning 1>&2)
else
  # Remove node_modules in preparation of release file generation
  sudo rm -rf "../../../frontend/dist/$frontend_build_mode/node_modules"
  sudo rm -rf "../../../backend/dist/node_modules"
fi
