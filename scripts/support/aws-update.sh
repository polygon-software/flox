# --------------------------------------------------------------
# Used for new releases in GitHub Actions (draft or live)
# Updates existing infrastructure without recreating everything
# --------------------------------------------------------------

if [[ $1 != "live" ]] && [[ $1 != "test" ]]
then
  echo "Invalid deployment mode $1"
  exit
fi

# ==========================================
# ==  Step 0: Preparation (get variables) ==
# ==========================================

# Create flox.tfvars file from flox.config.json in frontend & backend
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

# ==========================================
# ====       Step 1: Main Update        ====
# ==========================================

cd ../3_update || exit

# Replace 'TYPE' in config.tf with actual type (live, test)
sed -i -e "s/##TYPE##/$1/g" config.tf

# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/$project/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/$organisation/g" config.tf

# TODO
