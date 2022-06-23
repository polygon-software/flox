# Check valid mode
if [[ $1 != "live" ]] && [[ $1 != "test" ]]
then
  echo "Invalid mode $1"
  exit
fi

echo "Generating for: $1"

cd ../../backend || exit
yarn
yarn build
cp -a node_modules dist/

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

cd ../frontend || exit
yarn
cp "$1.env" running.env
yarn build:ssr # TODO handle non-ssr, ideally based on flox.config
cd dist/ssr || exit
yarn
zip -r ../../../scripts/terraform-deploy/frontend.zip * -q

cd ../../../scripts/terraform-deploy || exit
sed -i -e "s/##TYPE##/$1/g" config.tf
