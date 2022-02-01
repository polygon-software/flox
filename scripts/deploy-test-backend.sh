# PREREQUISITE: An ECS context, named 'soicontext' with valid credentials

docker context use default

# Build & push backend
echo Updating backend...
cd backend || return
docker build -t polygonsoftware/soi .
docker push polygonsoftware/soi

# Upload new versions
echo Deploying new versions to AWS...
cd ..
docker context use soicontext
docker compose up
