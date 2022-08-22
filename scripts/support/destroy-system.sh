# --------------------------------------------------------------
# Destroys the given system
# Takes four or five parameters:
# $1 - deployment mode: 'live', 'test', 'dev' or 'stage'
# $2 - local mode (will perform cleanup): true or not set
# $3 - force destruction
# $4 - 'confirm' for forcing destruction
# $5 - (optional) - staging branch name (e.g. stage-123412)
# Optionally, with third parameter set to 'true', will force destruction
# Be careful: this script may destroy infrastructure seen by customers!
# If destruction is forced, user must enter 'confirm' as fourth parameter
# --------------------------------------------------------------

mode=$1
local_mode=$2
force_deployment=$3
confirm_force_deployment=$4
staging_branch_name=$5

if [[ $mode != "live" ]] && [[ $mode != "test" ]]  && [[ $mode != "dev" ]] && [[ $mode != "stage" ]]
then
  echo "Invalid deployment mode $mode"
  exit 1
fi

REGEX_STAGE="^stage-[0-9]{6}$"
if [[ $mode == "stage" ]] &&  [[ ! $staging_branch_name =~ $REGEX_STAGE ]]
then
  echo "Invalid staging branch name $staging_branch_name"
  exit 1
fi

# ==========================================
# ===  Step 0: Pre-setup (Cognito, DNS)  ===
# ==========================================

# Create flox.tfvars file from flox.config.json in frontend & backend
bash create-flox-tfvars.sh "$mode"

if [[ $mode == "stage" ]]
then
  echo "type=\"$staging_branch_name\"" >> flox.tfvars
else
  echo "type=\"$mode\"" >> flox.tfvars
fi

cd ../aws-initial-setup/0_pre-setup || exit

# Get additional flox.config variables
project=$(jq '.general.project' ../../../backend/flox.config.json)
project=${project:1:-1}

frontend_build_mode=$(jq ".general.mode_$mode" ../../../frontend/flox.config.json)
frontend_build_mode=${frontend_build_mode:1:-1}

aws_region=$(jq '.general.aws_region' ../../../backend/flox.config.json)
aws_region=${aws_region:1:-1}

organisation=$(jq '.general.organisation' ../../../backend/flox.config.json)
organisation=${organisation:1:-1}

# Serverless mode (API only)
serverless_api=$(jq ".infrastructure_$mode.serverless_api" ../../../backend/flox.config.json)

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

# Check whether selected deployment is online (if online, fail if 'force' is not set to true)
online_status=$(curl -s --head "https://$url" | grep '200')
if [[ ($online_status || $mode == "live" || $mode == "test") && ( $force_deployment != "true"  || $confirm_force_deployment != "confirm")]]
then
  echo "Deployment in mode $mode is online at URL '$url', or is customer-facing! Use 'force' to force destruction anyways. (CAUTION: This may destroy live infrastructure!)"
  exit 1
fi

echo "=============================================="
echo "===  DESTROYING AWS INFRASTRUCTURE ($mode)  ==="
echo "=============================================="

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

# Replace 'TYPE' in config.tf with actual type (live, test, stage-123412 or dev)
if [[ $mode == "stage" ]]
then
    sed -i -e "s/##TYPE##/$staging_branch_name/g" config.tf

    # Return main workspace name (e.g. flox-stage-170809) so workspaces can be destroyed later
    workspace_name="$project-$staging_branch_name"
else
    sed -i -e "s/##TYPE##/$mode/g" config.tf
fi

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
# ==        Step 3: Destroy all           ==
# == (If staging, also destroy workspaces ==
# ==========================================

# Main Setup
terraform destroy -auto-approve -var-file="../../support/flox.tfvars"
if [[ $mode == "stage" ]]
then
  terraform workspace new default
  terraform workspace select default
  terraform workspace delete -force "$workspace_name"
fi

# Parent setup
cd ../1_parent-setup || exit
terraform destroy -auto-approve -var-file="../../support/flox.tfvars"
if [[ $mode == "stage" ]]
then
  terraform workspace new default
  terraform workspace select default
  terraform workspace delete -force "$workspace_name-parent-setup"
fi

# Pre-setup
cd ../0_pre-setup || exit
terraform destroy -auto-approve -var-file="../../support/flox.tfvars"
if [[ $mode == "stage" ]]
then
  terraform workspace new default
  terraform workspace select default
  terraform workspace delete -force "$workspace_name-pre-setup"
fi

# ==========================================
# ======      Step 4: Cleanup       ========
# ======    (only in local mode)    ========
# ==========================================
if [[ $local_mode == 'true' ]]
then
  # Remove .zip files
  rm -f ../2_main-setup/frontend.zip
  rm -f ../2_main-setup/backend.zip

  # Reset all config.tf files to their respective template files
  cp ../0_pre-setup/config.tftemplate ../0_pre-setup/config.tf
  cp ../1_parent-setup/config.tftemplate ../1_parent-setup/config.tf
  cp ../2_main-setup/config.tftemplate ../2_main-setup/config.tf
fi
