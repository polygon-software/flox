cd destroy-staging-workspaces || exit 1

# Initialize
terraform init | echo 1

terraform workspace new temp
terraform workspace select temp
workspaces=$(terraform workspace list)


while IFS= read -r workspace;
do
  if [[ $workspace == *"-stage-"* ]]; then
    echo "$workspace is staging workspace!"
  fi
done <<< "$workspaces"


terraform workspace delete temp
