rm -r dist
yarn build
ssh polygon@172.105.88.45 'rm -r frontend-dist'
scp -r dist/* polygon@172.105.88.45:frontend-dist
