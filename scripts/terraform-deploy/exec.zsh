terraform apply\
          -auto-approve\
          -var type="test"\
          -var user_pool_id="eu-central-1_6WcD8uyGs"\
          -var user_pool_client_id="***REMOVED***"\
          -var base_domain="soi.polygon-project.ch"\
          -var backend_base_domain="api.soi.polygon-project.ch"\
          -var email_sender="noreply@soi.polygon-project.ch"\
          -var hosted_zone_id="Z0371510SQXE0ONMB511"\
          -var cognito_arn="arn:aws:cognito-idp:eu-central-1:479836712535:userpool/eu-central-1_6WcD8uyGs"
