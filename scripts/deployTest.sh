# PREREQUISITE: An ECS context, named '[projectname]context' with valid credentials
# IMPORTANT: Ensure this is adapted to the specific project!
cd ..
docker context use default

# Build & push frontend
echo Updating frontend...
cd frontend || return
docker build -t polygonsoftware/full-stack-bootstrap-frontend .
docker push polygonsoftware/full-stack-bootstrap-frontend

# Build & push backend
echo Updating backend...
cd ..
cd backend || return
docker build -t polygonsoftware/full-stack-bootstrap-backend .
docker push polygonsoftware/full-stack-bootstrap-backend

# Upload new versions
echo Deploying new versions to AWS...
cd ..
docker context use ecscontext
docker compose --project-name bootstrap-test up
