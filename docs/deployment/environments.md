# Deployment Environments

## Overview

This document describes the deployment environments for the Little Lemon application, with a focus on ensuring consistent performance and functionality across all environments, particularly for mobile users.

## Environment Structure

The Little Lemon application uses the following deployment environments:

### 1. Development Environment

- **Purpose**: Local development and testing
- **URL**: `http://localhost:5173` (or similar local port)
- **Deployment**: Manual, via `npm run dev`
- **Branch**: Any local branch
- **Updates**: Continuous during development
- **Mobile Testing**: Using browser device emulation

### 2. Staging Environment

- **Purpose**: Integration testing and QA
- **URL**: `https://staging.littlelemon.heyitschien.com`
- **Deployment**: Automatic, via GitHub Actions
- **Branch**: `staging`
- **Updates**: On merge to staging branch
- **Mobile Testing**: Using real devices and BrowserStack

### 3. Production Environment

- **Purpose**: Live application for end users
- **URL**: `https://littlelemon.heyitschien.com`
- **Deployment**: Automatic, via GitHub Actions
- **Branch**: `main`
- **Updates**: On merge to main branch
- **Mobile Testing**: Using real devices and production monitoring

## Deployment Process

### Development to Staging

1. Developer creates feature branch from `staging`
2. Developer implements and tests feature locally
3. Developer creates pull request to `staging`
4. GitHub Actions runs tests
5. If tests pass, PR is automatically merged
6. Staging environment is automatically updated

### Staging to Production

1. QA team tests features on staging environment
2. Team creates pull request from `staging` to `main`
3. GitHub Actions runs tests
4. If tests pass, PR is automatically merged
5. Production environment is automatically updated

## Environment Configuration

Each environment uses environment variables for configuration:

```
# Development (.env.development)
VITE_API_URL=http://localhost:3000/api
VITE_ENABLE_MOCKS=true
VITE_DEBUG_MODE=true

# Staging (.env.staging)
VITE_API_URL=https://staging-api.littlelemon.heyitschien.com
VITE_ENABLE_MOCKS=false
VITE_DEBUG_MODE=true

# Production (.env.production)
VITE_API_URL=https://api.littlelemon.heyitschien.com
VITE_ENABLE_MOCKS=false
VITE_DEBUG_MODE=false
```

## Mobile-Specific Considerations

### 1. Responsive Testing

Each environment includes tools for testing responsive behavior:

- **Development**: Chrome DevTools Device Mode
- **Staging**: BrowserStack for real device testing
- **Production**: Real device testing and analytics

### 2. Performance Monitoring

Performance is monitored in each environment with a focus on mobile metrics:

- **Development**: Lighthouse in Chrome DevTools
- **Staging**: Automated Lighthouse CI
- **Production**: Real User Monitoring (RUM)

### 3. Progressive Web App (PWA) Features

PWA features are enabled differently across environments:

- **Development**: Service workers disabled by default
- **Staging**: Service workers enabled for testing
- **Production**: Full PWA capabilities enabled

## Deployment Verification

After deployment to any environment, the following verification steps are performed:

1. **Smoke Tests**:
   - Homepage loads correctly
   - Navigation works
   - Core functionality (menu, reservations) works

2. **Mobile-Specific Verification**:
   - Test on small, medium, and large mobile viewports
   - Verify touch interactions
   - Check performance metrics
   - Test offline capabilities (production only)

3. **Accessibility Verification**:
   - Run automated accessibility tests
   - Verify screen reader compatibility
   - Check color contrast and text readability

## Rollback Procedure

If issues are detected after deployment:

1. Identify the issue and its severity
2. For critical issues, immediately roll back to the previous version
3. For non-critical issues, create a hotfix branch
4. Test the hotfix in staging
5. Deploy the hotfix to production

## Deployment Schedule

- **Development**: Continuous
- **Staging**: Automated on PR merge, typically multiple times per day
- **Production**: Scheduled releases, typically once per week

## Monitoring and Alerts

Each environment is monitored for:

1. **Availability**: Uptime and response time
2. **Performance**: Core Web Vitals metrics
3. **Errors**: JavaScript errors and API failures
4. **Usage**: User behavior and feature usage

Alerts are configured for:
- Downtime
- Performance degradation
- Increased error rates
- Abnormal user behavior

## Mobile Analytics

Mobile-specific analytics are collected in staging and production:

1. **Device Types**: Distribution of mobile device types
2. **OS Versions**: Distribution of mobile OS versions
3. **Performance Metrics**: Mobile-specific performance data
4. **User Behavior**: Mobile-specific user flows and interactions

---

Last updated: 2025-05-30
