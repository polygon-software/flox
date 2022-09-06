# ==========================================================================
# Destroys all staging Terraform cloud workspaces for a given staging system
# Takes two parameters:
# $1: the staging branch name (e.g. 'stage-250813')
# $2: project name (e.g. 'flox')
# ==========================================================================

stage_branch=$1
project=$2

REGEX_STAGE="^stage-[0-9]{6}$"
if [[ ! $stage_branch =~ $REGEX_STAGE ]]
then
  echo "Invalid staging branch '$stage_branch'"
  exit 1
fi

# Select base workspace (e.g. 'stage-123004', since default may not exist)
export TF_WORKSPACE="$project-$stage_branch"

# Initialize
terraform init

# Unset workspace, so we can freely switch again
unset TF_WORKSPACE

# Create temp workspace & switch to it, so we can delete all staging workspaces
terraform workspace new temp
terraform workspace select temp

terraform init
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
    if [[ $workspace == *"-update"* ]]; then
      # Update workspaces must be force-deleted
      terraform workspace delete -force "$workspace"
    else
      # Other workspaces get regular deleted (prevents deletion if resources still present)
      terraform workspace delete "$workspace"
    fi
    # Increment counter
    ((destroyed_workspaces+=1))
  fi
done <<< "$workspaces"

echo "Done! Deleted $destroyed_workspaces cloud workspaces."
