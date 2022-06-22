#!/bin/bash

# Connects to the RDS PostgreSQL database instance via SSH, allowing you to access the database at localhost:5432
# Necessary variables:
# - EC2_ID:         Backend EC2 Instance ID
# - RDS_ENDPOINT:   RDS Endpoint (NOT read-only!)
# - PROFILE:   Terminal SSO profile name

# Ensure needed variables are given
if [ -z "$EC2_ID" ] || [ -z "$RDS_ENDPOINT" ] || [ -z "$PROFILE" ]
then
  echo "Missing one or more required variables!"
  exit
fi

echo "Connecting to EC2"

# Set up forwarding of database connection from EC2
nohup aws ssm send-command \
    --document-name "AWS-RunShellScript" \
    --targets "[{\"Key\":\"InstanceIds\",\"Values\":[\"${EC2_ID}\"]}]" \
    --parameters "{\"commands\":[\"sudo yum -y install socat\",\"socat TCP-LISTEN:5432,reuseaddr,fork TCP4:${RDS_ENDPOINT}:5432\"]}" \
    --profile "${PROFILE}"

echo "Establishing SSH connection on port 5432"

# Set up SSH port from EC2 to localhost
aws ssm start-session \
  --target "${EC2_ID}" \
  --document-name AWS-StartPortForwardingSession \
  --parameters "localPortNumber=5432,portNumber=5432" \
  --profile "${PROFILE}"

