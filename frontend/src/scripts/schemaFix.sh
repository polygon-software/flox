echo "Running schemaFix.sh"

# Load backend env variables, since they are enforced in process
if [ -f ../backend/.env ]; then
  export $(echo $(cat ../backend/.env | sed 's/#.*//g'| xargs) | envsubst)
fi

# Generate schema.gql from backend
ts-node ../backend/src/scripts/buildSchema.ts
schemaFile=./schema.gql

# If schema.gql exists, create schema.js in frontend
if test -f "$schemaFile"; then
  backendSchema=$(cat $schemaFile)
  rm -f src/apollo/schema.js
  echo "import gql from 'graphql-tag';\n/* eslint-disable import/prefer-default-export, graphql/template-strings */\nexport const schema = gql\`\n $backendSchema \n \`" >> src/apollo/schema.js
  echo "Successfully imported GraphQL schema"
else
  echo "Could not create schema.js, since schema.gql was not found. Assuming it already exists..."
fi
