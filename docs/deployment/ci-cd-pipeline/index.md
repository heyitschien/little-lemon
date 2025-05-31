# CI/CD Pipeline Documentation

## Overview

This section contains documentation related to the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the Little Lemon application.

## Contents

- [Workflow Configuration](./workflow-configuration.md) - GitHub Actions workflow configuration
- [Auto-Merge Guide](./auto-merge-guide.md) - Guide for implementing auto-merge functionality
- [Pipeline Explanation](./pipeline-explanation.md) - Explanation of the CI/CD pipeline

## Branch Strategy

The Little Lemon project uses the following branch strategy:
- `main`: Production branch
- `staging`: Pre-production branch for testing
- `feature/*`: Feature development branches

## Automated Processes

The CI/CD pipeline automates the following processes:
1. Running tests on pull requests
2. Auto-merging feature branches to staging when tests pass
3. Auto-merging staging to main when all checks pass
4. Deploying to appropriate environments

## Recent Updates

- **2025-05-30**: Initial CI/CD documentation structure created
