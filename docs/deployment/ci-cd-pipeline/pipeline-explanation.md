# CI/CD Pipeline with Automated Merging

## Overview

This document explains our Continuous Integration/Continuous Deployment (CI/CD) pipeline with automated Pull Request (PR) merging. The pipeline is designed to streamline our development workflow, ensure code quality, and maintain a stable production environment.

## Branching Strategy

Our project uses three types of branches:

1. **`feature/*` branches**: For developing new features or fixing bugs
2. **`staging` branch**: Integration branch for testing features before production
3. **`main` branch**: Production-ready code that is deployed to the live site

## Workflow Visualization: The LEGO Analogy

To help visualize our CI/CD pipeline, think of it like building with LEGOs:

1. **Your New LEGO Idea (`feature/*` branch)**
   * You build a new LEGO creation on its own building mat
   * This represents working on a `feature/*` branch (e.g., `feature/mobile-menu`)

2. **Show Your Idea (Pull Request to `staging`)**
   * When your LEGO creation is ready, you want to add it to the LEGO city
   * This represents creating a PR from your `feature/*` branch to the `staging` branch

3. **Robot LEGO Inspector (GitHub Actions - Automated Tests)**
   * A robot inspects your LEGO creation before it's added to the city
   * This is our GitHub Actions workflow running Playwright tests

4. **Robot Says "It's Good!" (Tests Pass)**
   * The robot inspector confirms your LEGO creation is well-built
   * This represents all tests passing successfully

5. **Magic Merge to Staging (Automated Merge)**
   * Your LEGO creation is automatically added to the "almost ready" city
   * This is the automated merge of your PR into the `staging` branch

6. **See it in the "Almost Ready" City (Vercel Staging Deployment)**
   * Your creation is visible in the preview city
   * This is Vercel deploying your code to the staging environment

7. **Ready for the Grand Opening! (Proposing `staging` to `main`)**
   * The "almost ready" city is prepared for public viewing
   * This represents creating a PR from `staging` to `main`

8. **Final Robot Check (More GitHub Actions)**
   * The robot does one final inspection of the entire city
   * This is GitHub Actions running tests on the `staging` to `main` PR

9. **Magic Merge to Main (Automated Merge)**
   * The "almost ready" city becomes the official city
   * This is the automated merge of `staging` into `main`

10. **Grand Opening! (Vercel Production Deployment)**
    * The final city is displayed for everyone to see
    * This is Vercel deploying your code to the production environment

## Technical Implementation

Our automated merge pipeline uses GitHub Actions and GitHub's branch protection rules:

### 1. GitHub Actions Workflow Configuration

We'll update our existing `playwright.yml` workflow to:
- Trigger on PRs to both `staging` and `main` branches
- Run comprehensive tests to ensure code quality
- Automatically enable PR auto-merge when tests pass

### 2. Branch Protection Rules

We'll configure GitHub branch protection for both `staging` and `main` branches:
- Require status checks (Playwright tests) to pass before merging
- Require pull requests for any changes
- Enable auto-merge capability

### 3. Vercel Deployment Configuration

Vercel is already configured to:
- Deploy all branches automatically
- Create preview deployments for PRs
- Deploy `staging` branch to a staging environment
- Deploy `main` branch to production

## Benefits of This Approach

- **Reduced Manual Work**: No need to manually click "merge" when tests pass
- **Faster Development Cycle**: Changes flow through the pipeline more quickly
- **Consistent Quality**: All code goes through the same testing process
- **Better Visibility**: Everyone can see the status of changes in the pipeline
- **Safer Deployments**: Production code is thoroughly tested before deployment