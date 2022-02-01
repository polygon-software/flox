# PREREQUISITE: An ECS context, named 'soicontext' with valid credentials

docker context use default

# Build & push frontend
echo Updating frontend...
cd frontend || return
docker build -t polygonsoftware/soi-frontend .
docker push polygonsoftware/soi-frontend

# Upload new versions
echo Deploying new versions to AWS...
cd ..
docker context use soicontext
docker compose up
