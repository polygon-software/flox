if [[ $1 != "live" ]] && [[ $1 != "test" ]]
then
  echo "Invalid deployment mode $1"
  exit
fi


zsh create-flox-tfvars.sh
cd ../cognito-tf || exit

# Replace 'TYPE' in config.tf with actual type (live, test)
sed -i -e "s/##TYPE##/$1/g" config.tf

project=$(jq '.general.project' ../../backend/flox.config.json)
project=${project:1:-1}

build_mode=$(jq '.general.mode' ../../frontend/flox.config.json)
build_mode=${build_mode:1:-1}

aws_region=$(jq '.general.aws_region' ../../backend/flox.config.json)
aws_region=${aws_region:1:-1}

organisation=$(jq '.general.organisation' ../../backend/flox.config.json)
organisation=${organisation:1:-1}

if [[ $1 == "test" ]]
then
  url=$(jq '.general.test_url' ../../backend/flox.config.json)
else
  url=$(jq '.general.live_url' ../../backend/flox.config.json)
fi
url=${url:1:-1}


# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/${project}/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/${organisation}/g" config.tf

terraform init
terraform apply -auto-approve -var-file="../support/flox.tfvars"
user_pool_id=$(terraform output user_pool_id)
user_pool_id=${user_pool_id:1:-1}

app_client_id=$(terraform output app_client_id)
app_client_id=${app_client_id:1:-1}

cd ../../frontend || exit
rm .env

echo "VUE_APP_GRAPHQL_ENDPOINT=$url" >> .env
echo "VUE_APP_NAME=$project-$1" >> .env
echo "VUE_APP_AWS_REGION=$aws_region" >> .env
echo "VUE_APP_USER_POOL_ID=$user_pool_id" >> .env
echo "VUE_APP_USER_POOL_CLIENT_ID=$app_client_id" >> .env

cd ../scripts/terraform-deploy || exit

zsh build.bash "$1" "$project" "$build_mode" "$organisation"

terraform init
terraform apply -auto-approve -var-file="../support/flox.tfvars"
