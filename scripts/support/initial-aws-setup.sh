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
project=$project:1:-1

build_mode=$(jq '.general.mode' ../../frontend/flox.config.json)
build_mode=$build_mode:1:-1

organisation=$(jq '.general.organisation' ../../backend/flox.config.json)
organisation=$organisation:1:-1

# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/${project}/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/${organisation}/g" config.tf

terraform init
testeroni=$(terraform apply -auto-approve -var-file="../support/flox.tfvars" -json)
echo "$testeroni"
cd ../terraform-deploy || exit

zsh build.bash "$1" "$project" "$build_mode" "$organisation"

terraform init
terraform apply -auto-approve -var-file="../support/flox.tfvars"
