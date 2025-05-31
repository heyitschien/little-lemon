# Pull Request Template

## Overview

This document provides the standard pull request template for the Little Lemon project and guidelines for creating effective pull requests.

## Pull Request Template

```markdown
# Description

[Provide a brief description of the changes introduced in this PR]

## Type of Change

Please check the options that are relevant:

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Code refactoring (no functional changes)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] UI/UX enhancement

## Mobile-Specific Changes

- [ ] No mobile-specific changes
- [ ] Mobile layout improvements
- [ ] Touch interaction enhancements
- [ ] Mobile performance optimizations
- [ ] Mobile-specific feature implementation

## How Has This Been Tested?

Please describe the tests that you ran to verify your changes:

- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing on desktop
- [ ] Manual testing on mobile devices
- [ ] Accessibility testing

**Test Configuration**:
* Device(s):
* OS(s):
* Browser(s):
* Viewport size(s):

## Screenshots (if applicable)

[Add screenshots showing before/after for UI changes, especially for mobile views]

## Checklist

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules
- [ ] I have verified my changes work correctly on mobile devices

## Related Issues

[Link any related issues here using the GitHub issue linking syntax: #issue-number]
```

## Guidelines for Creating Effective Pull Requests

### 1. Keep PRs Focused and Reasonably Sized

- Focus on a single feature, bug fix, or improvement
- Aim for less than 500 lines of code per PR
- Split large changes into multiple PRs when possible

### 2. Write Clear Descriptions

- Explain what changes were made and why
- Highlight any significant implementation details
- Note any mobile-specific considerations
- Reference related issues or tickets

### 3. Include Appropriate Tests

- Add unit tests for new functionality
- Update existing tests if behavior changes
- Include mobile-specific tests when relevant
- Verify tests pass locally before submitting

### 4. Document Your Changes

- Update relevant documentation
- Add inline code comments for complex logic
- Include JSDoc comments for functions and components
- Document any mobile-specific implementation details

### 5. Provide Visual Context for UI Changes

- Include before/after screenshots
- Show changes on both desktop and mobile viewports
- Highlight specific UI improvements
- Consider adding short screen recordings for interactive elements

### 6. Follow the Mobile-First Approach

- Ensure changes are designed for mobile first
- Test on various mobile viewport sizes
- Verify touch interactions work correctly
- Check performance on mobile devices

### 7. Self-Review Before Submission

- Review your own code critically
- Check for any debugging code or console logs
- Ensure code follows project style guidelines
- Verify all items in the checklist are addressed

## Mobile Testing Requirements

For PRs that affect the UI, test on the following configurations:

### Essential Mobile Testing Matrix

| Device Category | Viewport Size | Minimum Testing |
|-----------------|---------------|-----------------|
| Small Phone | 320x568px | Basic functionality |
| Medium Phone | 375x667px | Complete testing |
| Large Phone | 414x896px | Basic functionality |

### Extended Testing (for significant UI changes)

| Device | OS | Browser | Testing |
|--------|-------|---------|----------|
| iPhone SE | iOS 15+ | Safari | Core functionality |
| iPhone 13 | iOS 15+ | Safari | Complete testing |
| Pixel 6 | Android 12+ | Chrome | Complete testing |
| Galaxy S21 | Android 12+ | Chrome | Core functionality |

## PR Review Process

1. **Automated Checks**:
   - All PRs must pass automated tests and linting
   - CI/CD pipeline will verify builds on various configurations

2. **Code Review**:
   - At least one reviewer must approve changes
   - Address all review comments before merging
   - Re-request review after addressing comments

3. **Merge Requirements**:
   - All automated checks passing
   - Required reviews completed
   - All discussions resolved
   - Checklist items completed

4. **Auto-Merge**:
   - Feature branch to staging: Auto-merge if tests pass
   - Staging to main: Auto-merge if all checks pass

---

Last updated: 2025-05-30
