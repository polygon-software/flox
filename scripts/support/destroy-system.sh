# --------------------------------------------------------------
# Destroys the given system
# Takes two parameters:
# $1 - deployment mode: 'live', 'test' or 'dev'
# $2 - local mode (will perform cleanup): true or not set
# Optionally, with third parameter set to 'true', will force destruction
# Be careful: this script may destroy infrastructure seen by customers!
# If destruction is forced, user must enter 'confirm' as fourth parameter
# --------------------------------------------------------------

if [[ $1 != "live" ]] && [[ $1 != "test" ]] && [[ $1 != "dev" ]]
then
  echo "Invalid deployment mode $1"
  exit 1
fi

# ==========================================
# ===  Step 0: Pre-setup (Cognito, DNS)  ===
# ==========================================

# Create flox.tfvars file from flox.config.json in frontend & backend
bash create-flox-tfvars.sh "$1"
echo "type=\"$1\"" >> flox.tfvars

cd ../aws-initial-setup/0_pre-setup || exit

# Get additional flox.config variables
project=$(jq '.general.project' ../../../backend/flox.config.json)
project=${project:1:-1}

frontend_build_mode=$(jq ".general.mode_$1" ../../../frontend/flox.config.json)
frontend_build_mode=${frontend_build_mode:1:-1}

aws_region=$(jq '.general.aws_region' ../../../backend/flox.config.json)
aws_region=${aws_region:1:-1}

organisation=$(jq '.general.organisation' ../../../backend/flox.config.json)
organisation=${organisation:1:-1}

# Serverless mode (API only)
serverless_api=$(jq ".infrastructure_$1.serverless_api" ../../../backend/flox.config.json)

# Get system URL, e.g. test.flox.polygon-project.ch
url="$1.$project.polygon-project.ch"

# Check whether selected deployment is online (if online, fail if 'force' is not set to true)
online_status=$(curl -s --head "https://$url" | grep '200')
if [[ ($online_status || $1 == "live" || $1 == "test") && ( $3 != "true"  || $4 != "confirm")]]
then
  echo "Deployment in mode $1 is online at URL '$url', or is customer-facing! Use 'force' to force destruction anyways. (CAUTION: This may destroy live infrastructure!)"
  exit 1
fi

echo "=============================================="
echo "===  DESTROYING AWS INFRASTRUCTURE ($1)  ==="
echo "=============================================="

# Replace 'TYPE' in config.tf with actual type (dev, test or live)
sed -i -e "s/##TYPE##/$1/g" config.tf

# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/$project/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/$organisation/g" config.tf

# Add domain config to flox.tfvars
echo "# ======== Domain Config ========" >> ../../support/flox.tfvars
echo "domain=\"$url\"" >> ../../support/flox.tfvars

# Refresh Cognito Terraform state
terraform init
terraform refresh -var-file="../../support/flox.tfvars"
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

# ==========================================
# =====   Step 1: Parent DNS state    ======
# ==========================================
cd ../1_parent-setup || exit

# Replace 'TYPE' in config.tf with actual type (dev, test or live)
sed -i -e "s/##TYPE##/test/g" config.tf

# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/$project/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/$organisation/g" config.tf

# Refresh Parent DNS Terraform state
terraform init
terraform refresh -var-file="../../support/flox.tfvars"

# ==========================================
# ======     Step 2: Main state     ========
# ==========================================

cd ../2_main-setup || exit

# Replace 'TYPE' in config.tf with actual type (dev, test or live)
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

# Refresh main Terraform state
terraform init
terraform refresh -var-file="../../support/flox.tfvars"

# ==========================================
# ======    Step 3: Destroy all     ========
# ==========================================

terraform destroy -auto-approve -var-file="../../support/flox.tfvars"
cd ../1_parent-setup || exit
terraform destroy -auto-approve -var-file="../../support/flox.tfvars"
cd ../0_pre-setup || exit
terraform destroy -auto-approve -var-file="../../support/flox.tfvars"

# ==========================================
# ======      Step 4: Cleanup       ========
# ======    (only in local mode)    ========
# ==========================================
if [[ $2 == 'true' ]]
then
  # Remove .zip files
  rm -f ../2_main-setup/frontend.zip
  rm -f ../2_main-setup/backend.zip

  # Reset all config.tf files to their respective template files
  cp ../0_pre-setup/config.tftemplate ../0_pre-setup/config.tf
  cp ../1_parent-setup/config.tftemplate ../1_parent-setup/config.tf
  cp ../2_main-setup/config.tftemplate ../2_main-setup/config.tf
fi
