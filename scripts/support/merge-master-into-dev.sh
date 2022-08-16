# Merges the master branch back into dev.

echo "Merging master into dev"
git fetch --unshallow
git checkout dev
git pull
git merge --no-ff master -m "Auto-merge master back to dev"

exit
