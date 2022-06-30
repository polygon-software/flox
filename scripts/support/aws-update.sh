if [[ $1 != "live" ]] && [[ $1 != "test" ]]
then
  echo "Invalid deployment mode $1"
  exit
fi

# ==========================================
# ==  Step 0: Preparation (get variables) ==
# ==========================================

# TODO
