# Issue Template

## Overview

This document provides the standard issue templates for the Little Lemon project and guidelines for creating effective issues.

## Bug Report Template

```markdown
# Bug Report

## Description
A clear and concise description of the bug.

## Reproduction Steps
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Actual Behavior
A clear and concise description of what actually happened.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
 - Device: [e.g. iPhone 13, MacBook Pro]
 - OS: [e.g. iOS 15.4, macOS 12.3]
 - Browser: [e.g. Safari, Chrome]
 - Version: [e.g. 22]
 - Viewport Size: [e.g. 375x667]

## Mobile-Specific Information
- Does this issue only occur on mobile? [Yes/No]
- If yes, which mobile devices/viewports?
- Does it occur in both portrait and landscape orientations?
- Is it related to touch interactions?

## Additional Context
Add any other context about the problem here.

## Possible Solution
If you have suggestions on how to fix the bug, please describe them here.
```

## Feature Request Template

```markdown
# Feature Request

## Description
A clear and concise description of the feature you're requesting.

## Problem Statement
Describe the problem this feature would solve. Ex. I'm always frustrated when [...]

## Proposed Solution
A clear and concise description of what you want to happen.

## Mobile Considerations
- How should this feature work on mobile devices?
- Are there any mobile-specific requirements or constraints?
- How would touch interactions be handled?

## Alternatives Considered
A clear and concise description of any alternative solutions or features you've considered.

## Additional Context
Add any other context, screenshots, or mockups about the feature request here.

## User Impact
How would this feature benefit users? Which user personas would it help most?
```

## Enhancement Template

```markdown
# Enhancement

## Current Functionality
Describe the current functionality that you want to enhance.

## Proposed Enhancement
A clear and concise description of what you want to improve.

## Justification
Why is this enhancement needed? What benefits would it bring?

## Mobile Considerations
- How would this enhancement improve the mobile experience?
- Are there any mobile-specific optimizations needed?
- Would this affect performance on mobile devices?

## Implementation Ideas
If you have ideas on how to implement this enhancement, please describe them here.

## Screenshots/Mockups
If applicable, add screenshots or mockups to illustrate the enhancement.
```

## Documentation Issue Template

```markdown
# Documentation Issue

## Description
A clear and concise description of what's wrong or missing in the documentation.

## Location
Link to or description of where the documentation issue is located.

## Suggested Changes
A clear and concise description of how the documentation should be updated.

## Additional Context
Add any other context about the documentation issue here.
```

## Guidelines for Creating Effective Issues

### 1. Use the Right Template

- **Bug Report**: For reporting unexpected behavior or errors
- **Feature Request**: For suggesting new functionality
- **Enhancement**: For improving existing functionality
- **Documentation Issue**: For reporting documentation problems

### 2. Write Clear and Concise Titles

- Be specific about the issue
- Include key information in the title
- Make it searchable
- Examples:
  - Good: "Menu filter buttons not working on iOS Safari mobile"
  - Bad: "Mobile bug"

### 3. Provide Detailed Descriptions

- Clearly explain the issue or request
- Include all relevant information
- Be objective and factual
- Avoid assumptions

### 4. For Bug Reports

- Include precise reproduction steps
- Specify the environment (device, OS, browser)
- Describe both expected and actual behavior
- Include screenshots or videos when possible
- Note if the issue is mobile-specific

### 5. For Feature Requests and Enhancements

- Explain the problem being solved
- Describe the proposed solution
- Consider mobile use cases
- Include mockups or examples if possible
- Consider alternatives

### 6. Include Mobile Context

- Specify if the issue is mobile-specific
- Note which devices or viewports are affected
- Consider both portrait and landscape orientations
- Mention touch interactions if relevant
- Consider mobile performance implications

### 7. Use Labels Effectively

Common labels include:
- `bug`: Something isn't working
- `enhancement`: Improvement to existing features
- `feature`: New feature request
- `documentation`: Documentation-related issues
- `mobile`: Mobile-specific issues
- `performance`: Performance-related issues
- `accessibility`: Accessibility concerns
- `good first issue`: Good for newcomers

## Issue Lifecycle

1. **New**: Issue is created and awaiting triage
2. **Triage**: Issue is reviewed, categorized, and prioritized
3. **Accepted**: Issue is accepted for implementation
4. **In Progress**: Work has begun on the issue
5. **Review**: Solution is being reviewed
6. **Done**: Issue is resolved and closed

## Issue Prioritization

Issues are prioritized based on:

1. **Impact**: How many users are affected
2. **Severity**: How serious the issue is
3. **Urgency**: How quickly it needs to be fixed
4. **Effort**: How much work is required to fix it

Priority levels:
- **Critical**: Must be fixed immediately
- **High**: Should be fixed in the next release
- **Medium**: Should be fixed in a future release
- **Low**: Fix when resources allow

## Mobile-First Issue Handling

Since the Little Lemon application is primarily focused on mobile:

1. Mobile-specific issues are given higher priority
2. All issues must consider mobile impact
3. Mobile performance issues are treated with high importance
4. Touch interaction issues are considered critical for usability

---

Last updated: 2025-05-30
