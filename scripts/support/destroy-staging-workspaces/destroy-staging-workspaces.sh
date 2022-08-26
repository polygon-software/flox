# ==========================================================================
# Destroys all staging Terraform cloud workspaces for a given staging system
# Takes one parameter: the staging branch name (e.g. 'stage-250813')
# ==========================================================================

stage_branch=$1

REGEX_STAGE="^stage-[0-9]{6}$"
if [[ ! $stage_branch =~ $REGEX_STAGE ]]
then
  echo "Invalid staging branch '$stage_branch'"
  exit 1
fi

# Initialize & select first workspace (since default may not exist)
terraform init | echo 1

# Create temp workspace & switch to it, so we can delete all staging workspaces
terraform workspace new temp
terraform workspace select temp
workspaces=$(terraform workspace list)

destroyed_workspaces=0

while IFS= read -r workspace;
do
  # Trim whitespace
  workspace=$(echo "$workspace" | xargs)

  # Find corresponding staging workspaces
  if [[ $workspace == *"-$stage_branch"* ]]; then
    echo "Deleting workspace '$workspace'..."

    # Destroy workspace
    terraform workspace delete -force "$workspace"

    # Increment counter
    ((destroyed_workspaces+=1))
  fi
done <<< "$workspaces"

echo "Done! Deleted $destroyed_workspaces cloud workspaces."
