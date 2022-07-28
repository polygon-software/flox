# --------------------------------------------------------------
# Updates existing AWS infrastructure without recreating everything
# Used for new releases in GitHub Actions (draft or live)
# --------------------------------------------------------------

if [[ $1 != "live" ]] && [[ $1 != "test" ]]
then
  echo "Invalid deployment mode $1"
  exit
fi

# ==========================================
# ===  Step 0: Preparation (get params)  ===
# ==========================================

# Create flox.tfvars file from flox.config.json in frontend & backend
cd ../support || exit
zsh create-flox-tfvars.sh
echo "type=\"$1\"" >> flox.tfvars

# Get additional flox.config variables
project=$(jq '.general.project' ../../backend/flox.config.json)
project=${project:1:-1}

build_mode=$(jq '.general.mode' ../../frontend/flox.config.json)
build_mode=${build_mode:1:-1}

aws_region=$(jq '.general.aws_region' ../../backend/flox.config.json)
aws_region=${aws_region:1:-1}

organisation=$(jq '.general.organisation' ../../backend/flox.config.json)
organisation=${organisation:1:-1}

serverless=$(jq '.general.serverless' ../../backend/flox.config.json)

if [[ $1 == "test" ]]
then
  url=$(jq '.general.test_base_domain' ../../backend/flox.config.json)
else
  url=$(jq '.general.live_base_domain' ../../backend/flox.config.json)
fi
url=${url:1:-1}

# Go to pre-update folder
cd ../aws-update/0_pre-update || exit

# Replace 'TYPE' in config.tf with actual type (live, test)
sed -i -e "s/##TYPE##/$1/g" config.tf

# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/$project/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/$organisation/g" config.tf

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

# Add Domain & Cognito outputs to flox.tfvars
echo "# ======== Domain Config ========" >> ../../support/flox.tfvars
echo "base_domain=\"$url\"" >> ../../support/flox.tfvars
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
echo "VUE_APP_GRAPHQL_ENDPOINT=https://api.$url/graphql" >> .env
echo "VUE_APP_NAME=$project-$1" >> .env
echo "VUE_APP_AWS_REGION=$aws_region" >> .env
echo "VUE_APP_USER_POOL_ID=$user_pool_id" >> .env
echo "VUE_APP_USER_POOL_CLIENT_ID=$user_pool_client_id" >> .env

# Go to update folder
cd ../scripts/aws-update/1_update || exit

# Replace 'TYPE' in config.tf with actual type (live, test)
sed -i -e "s/##TYPE##/$1/g" config.tf

# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/$project/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/$organisation/g" config.tf

cd ../../support || exit

# Build & zip frontend and backend
if [[ $serverless == "true" ]]
then
  # Build in serverless mode for AWS lambda
  echo "Building for serverless deployment..."
  zsh build.sh "$project" "$build_mode" true
else
  # Regular build
  echo "Building for regular deployment"
  zsh build.sh "$project" "$build_mode"
fi

cd ../aws-update/1_update || exit

cp ../../outputs/frontend.zip frontend.zip
cp ../../outputs/backend.zip backend.zip

# If non-ssr: unzip dist files for direct S3 upload
if [[ $build_mode != "ssr" ]]
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
cd ../../aws-initial-setup/2_main-setup || exit

# Copy .zips, so terraform can handle resources
cp ../../outputs/frontend.zip frontend.zip
cp ../../outputs/backend.zip backend.zip

# Replace 'TYPE' in config.tf with actual type (live, test)
sed -i -e "s/##TYPE##/$1/g" config.tf

# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/$project/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/$organisation/g" config.tf

terraform init

if [[ $build_mode != "ssr" ]]
then
  if [[ $serverless == true ]]
  then
    # In serverless mode, also renew lambda
    terraform apply -target=aws_elastic_beanstalk_environment.api_env -target="module.api-serverless[0].aws_lambda_function.api_lambda" -auto-approve -var-file="../../support/flox.tfvars"
  else
    terraform apply -target=aws_elastic_beanstalk_environment.api_env -auto-approve -var-file="../../support/flox.tfvars"
  fi
# For SSR mode, also redeploy SSR frontend
else
  if [[ $serverless == true ]]
    then
      # In serverless mode, also renew lambda
      terraform apply -target=aws_elastic_beanstalk_environment.api_env -target="module.web_ssr[0].aws_elastic_beanstalk_environment.frontend_env" -target="module.api-serverless[0].aws_lambda_function.api_lambda" -auto-approve -var-file="../../support/flox.tfvars"
    else
      terraform apply -target=aws_elastic_beanstalk_environment.api_env -target="module.web_ssr[0].aws_elastic_beanstalk_environment.frontend_env" -auto-approve -var-file="../../support/flox.tfvars"
    fi

fi

# ==========================================
# ====         Step 3: Cleanup         =====
# ==========================================

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
