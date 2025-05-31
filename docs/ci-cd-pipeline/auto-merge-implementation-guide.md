# CI/CD Pipeline Implementation Guide

This document provides detailed, step-by-step instructions for implementing our automated merge CI/CD pipeline for the Little Lemon project.

## Prerequisites

- GitHub repository with `main`, `staging`, and `feature/*` branches
- Existing Vercel integration for deployments
- Administrator access to the GitHub repository

## Implementation Steps

### Step 1: Update GitHub Actions Workflow

We need to modify our existing `playwright.yml` workflow to support our new CI/CD pipeline with automated merging.

1. Navigate to your repository on GitHub
2. Go to the `.github/workflows` directory
3. Edit the `playwright.yml` file
4. Replace the current content with the following:

```yaml
name: Playwright Tests and Auto-Merge

on:
  # Run on PRs to staging and main
  pull_request:
    branches: [ staging, main ]
    types: [opened, synchronize, reopened]
  
  # Also run on direct pushes to main and staging
  push:
    branches: [ main, staging ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
    
    # Add auto-merge step for PRs
    - name: Enable Auto-Merge for PR
      if: |
        github.event_name == 'pull_request' && 
        success() && 
        (github.base_ref == 'staging' || github.base_ref == 'main')
      uses: peter-evans/enable-pull-request-automerge@v3
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        merge-method: squash
        pull-request-number: ${{ github.event.pull_request.number }}
```

### Step 2: Update GitHub Repository Settings

1. Navigate to your repository on GitHub
2. Go to Settings > General > Pull Requests
3. Check the box for "Allow auto-merge"
4. Save changes

### Step 3: Configure Branch Protection Rules for Staging Branch

1. Navigate to your repository on GitHub
2. Go to Settings > Branches
3. Click "Add rule" or edit an existing rule for the `staging` branch
4. Configure the following settings:
   - Check "Require a pull request before merging"
   - Check "Require status checks to pass before merging"
   - In the status checks search box, find and select "test" (the job name from our workflow)
   - Check "Require branches to be up to date before merging"
   - Optionally, check "Require linear history" for cleaner Git history
5. Click "Create" or "Save changes"

### Step 4: Configure Branch Protection Rules for Main Branch

1. Navigate to your repository on GitHub
2. Go to Settings > Branches
3. Click "Add rule" or edit an existing rule for the `main` branch
4. Configure the following settings:
   - Check "Require a pull request before merging"
   - Check "Require status checks to pass before merging"
   - In the status checks search box, find and select "test" (the job name from our workflow)
   - Check "Require branches to be up to date before merging"
   - Optionally, check "Require linear history" for cleaner Git history
   - Consider checking "Include administrators" to enforce these rules for everyone
5. Click "Create" or "Save changes"

### Step 5: Configure GitHub Token Permissions (if needed)

If the default `GITHUB_TOKEN` doesn't have sufficient permissions:

1. Navigate to your repository on GitHub
2. Go to Settings > Actions > General
3. Scroll down to "Workflow permissions"
4. Select "Read and write permissions"
5. Check "Allow GitHub Actions to create and approve pull requests"
6. Click "Save"

### Step 6: Verify Vercel Deployment Configuration

1. Log in to your Vercel account
2. Navigate to your Little Lemon project
3. Go to Settings > Git
4. Ensure the following settings are configured:
   - Production Branch: `main`
   - Framework Preset: Correct for your project (e.g., Next.js)
   - Build and Development Settings: Correctly configured
   - Preview Deployment: Enabled for all branches and PRs

## Testing the Pipeline

To test the automated CI/CD pipeline:

### Feature to Staging Flow

1. Create a new feature branch: `git checkout -b feature/test-auto-merge`
2. Make a small change to the codebase
3. Commit and push the change: 
   ```
   git add .
   git commit -m "Test auto-merge pipeline"
   git push -u origin feature/test-auto-merge
   ```
4. Create a Pull Request from `feature/test-auto-merge` to `staging`
5. Observe that:
   - GitHub Actions runs the Playwright tests
   - If tests pass, the PR is automatically merged into `staging`
   - Vercel creates a deployment for the updated `staging` branch

### Staging to Main Flow

1. Create a Pull Request from `staging` to `main`
2. Observe that:
   - GitHub Actions runs the Playwright tests again
   - If tests pass, the PR is automatically merged into `main`
   - Vercel deploys the changes to the production environment

## Troubleshooting

### Auto-Merge Not Working

If auto-merge isn't working:

1. Check GitHub Actions logs for any errors
2. Verify that the workflow ran successfully
3. Ensure branch protection rules are correctly configured
4. Confirm that "Allow auto-merge" is enabled in repository settings
5. Check that the GitHub token has sufficient permissions

### Tests Failing

If tests are failing:

1. Review the Playwright test report in GitHub Actions artifacts
2. Fix any issues in your code
3. Push the changes to your feature branch
4. The workflow will run again automatically

## Maintenance

Regularly review and update the CI/CD pipeline:

1. Keep GitHub Actions dependencies updated
2. Adjust branch protection rules as needed
3. Update test requirements as the project evolves
4. Monitor workflow execution times and optimize if necessary

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright Testing Documentation](https://playwright.dev/docs/intro)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
