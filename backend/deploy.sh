rm -r dist
yarn build
ssh polygon@172.105.88.45 'rm -r node-backend/dist'
scp -r dist polygon@172.105.88.45:node-backend/dist
scp .env polygon@172.105.88.45:node-backend/.env
scp package.json polygon@172.105.88.45:node-backend/package.json
scp yarn.lock polygon@172.105.88.45:node-backend/yarn.lock
