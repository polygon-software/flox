# Builds & zips both front- and backend in the correct modes
# Necessary variables:
# - Project name
# - Frontend mode ('spa', 'pwa' or 'ssr')
# Optional variables:
# - Serverless build mode (setting 'true' will use lambda build mode for minimal output)

# Check valid frontend mode
if [[ $2 != "spa" ]] && [[ $2 != "pwa" ]] && [[ $2 != "ssr" ]]
then
  echo "Invalid frontend mode $2"
  exit
fi

# Depending on serverless status, log
if [[ $3 == "true" ]]
then
  echo "Generating for project $1 (Frontend: $2, Backend: serverless)"
else
  echo "Generating for project $1 (Frontend: $2)"
fi
# Build backend
cd ../../backend || exit

# Delete existing dist
rm -rf dist

yarn
if [[ $3 == "true" ]]
then
  # Install node-prune for serverless build
  yarn global add node-prune

  # Allow deletion of contents in node_modules through node_prune
  sudo chmod -R 777 ./node_modules

  # Build for AWS lambda (includes minifying node_modules)
  sudo yarn build:lambda
else
  sudo yarn build
fi

# Copy node_modules to output directory
cp -a node_modules dist/

# Build package.json
echo "{
   \"name\": \"$1\",
   \"version\": \"0.0.1\",
   \"description\": \"\",
   \"author\": \"\",
   \"private\": true,
   \"license\": \"UNLICENSED\",
   \"scripts\":{
        \"start\": \"node src/main.js\"
   },
   \"dependencies\":
 " >> dist/package.json

echo "$(<package.json)" | jq '.dependencies' >> dist/package.json
echo ',   "devDependencies":' >> dist/package.json
echo "$(<package.json)" | jq '.devDependencies' >> dist/package.json
echo ',   "babel":' >> dist/package.json
echo "$(<package.json)" | jq '.babel' >> dist/package.json
echo ',   "engines":' >> dist/package.json
echo "$(<package.json)" | jq '.engines' >> dist/package.json
echo '}' >> dist/package.json

cd dist || exit

# Remove old .zip (if any)
rm -f ../../scripts/outputs/backend.zip

# Zip contents of dist folder
zip -r ../../scripts/outputs/backend.zip * -q
cd ..

cd ../frontend || exit

# Delete existing dist
rm -rf dist

yarn

# SPA Mode
if [[ $2 == "spa" ]]
then
  yarn build
  cd dist/spa || exit
# SSR Mode
elif [[ $2 == "ssr" ]]
then
  yarn build:ssr
  cd dist/ssr || exit

  # Install modules
  yarn
# PWA Mode
elif [[ $2 == "pwa" ]]
then
  yarn build:pwa
  cd dist/pwa || exit
fi

# Zip files
zip -r ../../../scripts/outputs/frontend.zip * -q

cd ../ || exit
