#!/bin/bash

# Connects to the prod/test/dev RDS PostgreSQL database instance via SSH, allowing you to access the database at localhost:5432
# Necessary variables:
# - EC2_ID:         Backend EC2 Instance ID
# - RDS_ENDPOINT:   RDS Endpoint (NOT read-only!)
# - PROFILE:        Terminal SSO profile name
# - SERVERLESS:     Whether the backend is running in serverless mode (true or false) - this means the given EC2 instance is one used only for database port-forwarding
# - DB_NAME:        Database name
# - DB_USERNAME:    Database username
# - DB_PASSWORD:    Database password

aws sso login --profile "$PROFILE"

# Ensure needed variables are given
if [ -z "$EC2_ID" ] || [ -z "$RDS_ENDPOINT" ] || [ -z "$PROFILE" ]
then
  echo "Missing one or more required variables!"
  exit
fi

echo "Connecting to EC2"

# Commands to execute on remote machine
commandsToExecute="\"sudo yum -y install socat\",\"socat TCP-LISTEN:5432,reuseaddr,fork TCP4:${RDS_ENDPOINT}:5432\""

# If running in serverless mode, we also need to install psql & connect to database
# (since the EC2 instance is not the backend, therefore not connected to DB yet)
if [[ $SERVERLESS == "true" ]]
then
  commandsToExecute="${commandsToExecute},\"sudo amazon-linux-extras install postgresql10\",\"export PGPASSWORD='${DB_PASSWORD}'\",\"psql --host=${RDS_ENDPOINT} --username=${DB_USERNAME} --dbname=${DB_NAME}\""
fi

# Set up forwarding of database connection from EC2
nohup aws ssm send-command \
    --document-name "AWS-RunShellScript" \
    --targets "[{\"Key\":\"InstanceIds\",\"Values\":[\"${EC2_ID}\"]}]" \
    --parameters "{\"commands\":[${commandsToExecute}]}" \
    --profile "${PROFILE}"

echo "Establishing SSH connection on port 5432"

# Set up SSH port from EC2 to localhost
aws ssm start-session \
  --target "${EC2_ID}" \
  --document-name AWS-StartPortForwardingSession \
  --parameters "localPortNumber=5432,portNumber=5432" \
  --profile "${PROFILE}"

