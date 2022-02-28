cd ../../backend
yarn
yarn build
cp -a node_modules dist/

echo '{
   "name": "nest-test",
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

echo $(<package.json) | jq '.dependencies' >> dist/package.json
echo ',\n   "devDependencies":' >> dist/package.json
echo $(<package.json) | jq '.devDependencies' >> dist/package.json
echo ',\n   "babel":' >> dist/package.json
echo $(<package.json) | jq '.babel' >> dist/package.json
echo ',\n   "engines":' >> dist/package.json
echo $(<package.json) | jq '.engines' >> dist/package.json
echo '}' >> dist/package.json
cd dist
zip -r ../../scripts/terraform-deploy/backend.zip * -q
cd ..

cd ../frontend
yarn
yarn build:ssr
cp -a node_modules dist/ssr/

rm dist/ssr/package.json

echo '{
        "name": "soi",
        "version": "0.0.1",
        "description": "Strategic Opportunity Investment AG",
        "productName": "S.O.I Chamäleon",
        "author": "davwys <david.wyss@hotmail.ch>",
        "private": true,
        "scripts":{
            "start": "node index.js"
        },
        "dependencies":
 ' >> dist/ssr/package.json

echo $(<package.json) | jq '.dependencies' >> dist/ssr/package.json
echo ',\n   "devDependencies":' >> dist/ssr/package.json
echo $(<package.json) | jq '.devDependencies' >> dist/ssr/package.json
echo ',\n   "browserslist":' >> dist/ssr/package.json
echo $(<package.json) | jq '.browserslist' >> dist/ssr/package.json
echo ',\n   "engines":' >> dist/ssr/package.json
echo $(<package.json) | jq '.engines' >> dist/ssr/package.json
echo ',\n   "jestSonar":' >> dist/ssr/package.json
echo $(<package.json) | jq '.jestSonar' >> dist/ssr/package.json
echo '}' >> dist/ssr/package.json
cd dist/ssr
zip -r ../../../scripts/terraform-deploy/frontend.zip * -q
