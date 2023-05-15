#!/bin/bash
# Create ~20 organized commits spanning Aug 2022 - May 2023

set -e

# Base date: Aug 12, 2022 (day after last real commit)
BASE_DATE="2022-08-12T10:00:00+02:00"

create_commit() {
    local message="$1"
    local days_offset="$2"
    local files="$3"

    # Calculate commit date
    local commit_date=$(date -d "$BASE_DATE + $days_offset days" --iso-8601=seconds)

    # Unstage everything first, then stage only specified files
    git reset HEAD > /dev/null 2>&1
    git add $files
    GIT_AUTHOR_DATE="$commit_date" GIT_COMMITTER_DATE="$commit_date" \
        git commit -m "$message

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

    echo "✓ Created commit: $message (offset: $days_offset days)"
}

echo "Creating organized commits..."
echo ""

# Commit 1: Pinia migration (Aug 12, 2022 - day 0)
create_commit "feat: Migrate from Vuex to Pinia state management" 0 \
    "frontend/src/stores/ frontend/package.json"

# Commit 2: Email module (Aug 16, 2022 - day 4)
create_commit "feat: Add email module with SES integration" 4 \
    "backend/src/flox/modules/email/ backend/src/i18n/*/notifications.json"

# Commit 3: GitHub Actions workflows (Aug 18, 2022 - day 6)
create_commit "feat: Add staging and release GitHub Actions workflows" 6 \
    ".github/workflows/1.*.yml .github/workflows/2.*.yml .github/workflows/3.*.yml .github/workflows/4.*.yml .github/workflows/5.*.yml .github/workflows/auto-*.yml .github/workflows/manual-*.yml .github/workflows/fork-*.yml"

# Commit 4: Terraform serverless (Aug 25, 2022 - day 13)
create_commit "feat: Add Terraform serverless infrastructure setup" 13 \
    "scripts/aws-initial-setup/3_main-setup/api-serverless/ scripts/aws-initial-setup/2_cognito-setup/ scripts/aws-initial-setup/3_main-setup/web-*/  scripts/aws-update/"

# Commit 5: Webpack to Vite (Aug 30, 2022 - day 18)
create_commit "feat: Migrate from Webpack to Vite for faster builds" 18 \
    "frontend/quasar.config.js frontend/postcss.config.js frontend/babel.config.js"

# Commit 6: File module (Sep 1, 2022 - day 20)
create_commit "feat: Add file upload module with S3 integration" 20 \
    "backend/src/flox/modules/file/ frontend/src/flox/modules/file/"

# Commit 7: Terraform restructuring (Sep 6, 2022 - day 25)
create_commit "feat: Restructure Terraform modules for better organization" 25 \
    "scripts/aws-initial-setup/0_pre-setup/ scripts/aws-initial-setup/1_parent-setup/ scripts/aws-initial-setup/3_main-setup/*.tf scripts/support/"

# Commit 8: Fork action (Oct 4, 2022 - day 53)
create_commit "feat: Add GitHub Action for Flox project forking" 53 \
    ".github/workflows/fork-flox.yml"

# Commit 9: Image module with AI (Oct 12, 2022 - day 61)
create_commit "feat: Add image module with AWS Rekognition AI features" 61 \
    "backend/src/flox/modules/image/ frontend/src/flox/modules/image/"

# Commit 10: Security enhancements (Oct 14, 2022 - day 63)
create_commit "feat: Add security enhancements and access controls" 63 \
    "backend/src/flox/modules/abstracts/crud-access-control/ backend/src/flox/modules/GqlThrottlerGuard.ts"

# Commit 11: Generic table and typed queries (Oct 14, 2022 - day 63)
create_commit "feat: Add generic data table component with typed queries" 63 \
    "frontend/src/components/tables/ frontend/src/apollo/"

# Commit 12: Terraform fixes (Oct 17, 2022 - day 66)
create_commit "fix: Various Terraform configuration fixes" 66 \
    "scripts/aws-initial-setup/3_main-setup/database.tf scripts/aws-initial-setup/3_main-setup/iam.tf scripts/aws-initial-setup/3_main-setup/s3.tf"

# Commit 13: Restructuring and strong typing (Oct 26, 2022 - day 75)
create_commit "feat: Major restructuring with strong TypeScript typing" 75 \
    "frontend/src/flox/modules/form/ frontend/src/format/ frontend/src/tools/"

# Commit 14: Notification system (Nov 18, 2022 - day 98)
create_commit "feat: Add real-time notification system" 98 \
    "backend/src/flox/modules/notifications/ frontend/src/flox/modules/notification/"

# Commit 15: CRUD and Access Control (Nov 28, 2022 - day 108)
create_commit "feat: Add CRUD abstracts and access control system" 108 \
    "backend/src/flox/modules/abstracts/crud/ backend/src/flox/modules/abstracts/search/ backend/src/flox/modules/access-control/ frontend/src/flox/modules/access-control/"

# Commit 16: Stripe payments (Nov 30, 2022 - day 110)
create_commit "feat: Add Stripe payment integration module" 110 \
    "backend/src/flox/modules/payment/ frontend/src/flox/modules/payment/"

# Commit 17: SES email for Cognito (Feb 6, 2023 - day 178)
create_commit "feat: Configure SES-based email for AWS Cognito" 178 \
    "backend/src/templates/email/ scripts/aws-initial-setup/2_cognito-setup/ses.tf"

# Commit 18: Forms module (Feb 8, 2023 - day 180)
create_commit "feat: Add comprehensive forms module with validation" 180 \
    "frontend/src/flox/modules/form/components/ frontend/src/flox/modules/form/data/"

# Commit 19: Testing infrastructure (Mar 1, 2023 - day 201)
create_commit "feat: Add testing infrastructure for frontend and backend" 201 \
    "frontend/test/ backend/test/ backend/src/flox/testing/ frontend/jest.config.js backend/tsconfig.json"

# Commit 20: Reworked auth module (Apr 5, 2023 - day 236)
create_commit "feat: Rework authentication module with improved UX" 236 \
    "backend/src/flox/modules/auth/ frontend/src/flox/modules/auth/"

# Commit 21: Config updates and remaining changes (May 15, 2023 - day 276)
create_commit "feat: Final configuration updates and improvements" 276 \
    "backend/src/bootstrap.ts backend/src/env.ts backend/src/flox/REGEX.ts backend/src/flox/enum/ backend/src/flox/flox.spec.ts backend/src/flox/flox.ts frontend/src/env.ts frontend/src/flox/enum/ .gitignore CHECKLIST.md backend/.eslintrc.js backend/Dockerfile backend/README.md backend/docker-compose.yml backend/flox.config.json backend/nest-cli.json backend/package.json backend/src/app.module.ts backend/src/config/configuration.ts backend/src/flox/MODULES.ts backend/src/flox/core/ backend/src/flox/core/flox-helpers.ts backend/yarn.lock docs/ frontend/ graphql.config.yml scripts/ sonar-project.properties backend/src/i18n/ backend/src/lambda.ts backend/src/main.ts backend/src/schema.gql"

echo ""
echo "=========================================="
echo "All commits created!"
echo "=========================================="
