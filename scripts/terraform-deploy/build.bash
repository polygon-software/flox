# Builds & zips both front- and backend in the correct modes
# Necessary variables:
# - Deployment mode ('live' or 'test')
# - Project name
# - Frontend mode ('spa', 'pwa' or 'ssr')

# Check valid deployment mode
if [[ $1 != "live" ]] && [[ $1 != "test" ]]
then
  echo "Invalid deployment mode $1"
  exit
fi

# Check valid frontend mode
if [[ $3 != "spa" ]] && [[ $3 != "pwa" ]] && [[ $3 != "ssr" ]]
then
  echo "Invalid frontend mode $3"
  exit
fi

echo "Generating for project $2 in mode $1 ($3)"

# Build backend
cd ../../backend || exit
yarn
yarn build
cp -a node_modules dist/

# Build package.json
echo '{
   "name": "flox",
   "version": "0.0.1",
   "description": "",
   "author": "",
   "private": true,
   "license": "UNLICENSED",
   "scripts":{
        "start": "node main.js"
   },
   "dependencies":
 ' >> dist/package.json

echo "$(<package.json)" | jq '.dependencies' >> dist/package.json
echo ',   "devDependencies":' >> dist/package.json
echo "$(<package.json)" | jq '.devDependencies' >> dist/package.json
echo ',   "babel":' >> dist/package.json
echo "$(<package.json)" | jq '.babel' >> dist/package.json
echo ',   "engines":' >> dist/package.json
echo "$(<package.json)" | jq '.engines' >> dist/package.json
echo '}' >> dist/package.json
cd dist || exit
zip -r ../../scripts/terraform-deploy/backend.zip * -q
cd ..

# Use appropriate .env file as 'running.env'
cd ../frontend || exit
yarn
cp "$1.env" running.env

# SPA Mode
if [[ $3 == "spa" ]]
then
  yarn build
  cd dist/spa || exit
# SSR Mode
elif [[ $3 == "ssr" ]]
then
  yarn build:ssr
  cd dist/ssr || exit
# PWA Mode
elif [[ $3 == "pwa" ]]
then
  yarn build:pwa
  cd dist/pwa || exit
fi

# Install modules & zip
yarn
zip -r ../../../scripts/terraform-deploy/frontend.zip * -q

cd ../../../scripts/terraform-deploy || exit

# Replace 'TYPE' in config.tf with actual type (live, test)
sed -i -e "s/##TYPE##/$1/g" config.tf

# Replace 'PROJECT' in config.tf with actual project name
sed -i -e "s/##PROJECT##/$2/g" config.tf

# Replace 'ORGANISATION' in config.tf with actual organisation name
sed -i -e "s/##ORGANISATION##/${4}/g" config.tf