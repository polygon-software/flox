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

# TODO
