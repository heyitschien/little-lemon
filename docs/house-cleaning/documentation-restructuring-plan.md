# Little Lemon Project - Documentation Restructuring Plan

## Overview

This document provides a detailed implementation plan for restructuring the Little Lemon project documentation to align with industry standards. The goal is to create a well-organized, navigable, and comprehensive documentation structure that supports the project's development, maintenance, and onboarding processes.

## Industry Standards for Documentation Structure

The proposed structure follows industry best practices from established documentation frameworks including:

1. **Diátaxis Framework** - A systematic approach to technical documentation that separates content into tutorials, how-to guides, technical reference, and explanation
2. **Google Developer Documentation Style Guide** - Recommendations for organizing and structuring technical documentation
3. **Microsoft Docs Structure** - Hierarchical organization with clear categorization and navigation
4. **React Documentation Patterns** - Organization patterns from the React ecosystem

Key principles incorporated:

- **Hierarchical organization** - Logical grouping from general to specific
- **Clear separation of concerns** - Different types of documentation in appropriate categories
- **Consistent naming conventions** - Predictable file and directory naming
- **Progressive disclosure** - Overview documents leading to detailed specifics
- **Cross-referencing** - Internal linking between related documentation

## Current vs. Proposed Structure

### Current Structure Issues

1. Inconsistent naming conventions (e.g., `wire-frame` vs `ui-style`)
2. Mixed levels of documentation (high-level and detailed docs in the same directories)
3. Lack of index files for navigation
4. Some related documentation spread across different directories
5. Unclear organization for feature-specific documentation

### Proposed Structure

```
docs/
├── index.md                         # Main documentation index
├── architecture/                    # System architecture documentation
│   ├── index.md                     # Architecture documentation index
│   ├── high-level-overview.md       # High-level system overview
│   ├── component-architecture.md    # Component architecture details
│   └── project-structure.md         # Project structure documentation
├── design/                          # Design documentation
│   ├── index.md                     # Design documentation index
│   ├── style-guide/                 # UI style guidelines
│   │   ├── index.md                 # Style guide overview
│   │   ├── color-palette.md         # Color specifications
│   │   ├── typography.md            # Typography specifications
│   │   └── assets/                  # Style guide assets
│   ├── wireframes/                  # Wireframes and mockups
│   │   ├── index.md                 # Wireframes overview
│   │   ├── images/                  # Wireframe images
│   │   └── specifications.md        # Detailed specifications
│   └── features/                    # Feature-specific design docs
│       ├── index.md                 # Features overview
│       ├── chat-assistant/          # Chat assistant feature design
│       ├── menu/                    # Menu feature design
│       └── reservation/             # Reservation feature design
├── development/                     # Development documentation
│   ├── index.md                     # Development documentation index
│   ├── getting-started.md           # Getting started guide
│   ├── coding-standards.md          # Coding standards and conventions
│   ├── component-guidelines.md      # Component development guidelines
│   ├── mobile-optimization.md       # Mobile optimization guidelines
│   └── house-cleaning/              # House cleaning documentation
│       ├── index.md                 # House cleaning overview
│       ├── project-house-cleaning.md # House cleaning plan
│       ├── phase1-log.md            # Phase 1 log
│       ├── phase2-log.md            # Phase 2 log
│       └── post-cleanup-plan.md     # Post-cleanup action plan
├── testing/                         # Testing documentation
│   ├── index.md                     # Testing documentation index
│   ├── testing-strategy.md          # Overall testing strategy
│   ├── unit-testing/                # Unit testing documentation
│   │   ├── index.md                 # Unit testing overview
│   │   ├── component-testing.md     # Component testing guide
│   │   └── hooks-testing.md         # Custom hooks testing guide
│   └── e2e-testing/                 # End-to-end testing documentation
│       ├── index.md                 # E2E testing overview
│       ├── playwright-setup.md      # Playwright configuration guide
│       └── test-scenarios.md        # Test scenarios documentation
├── deployment/                      # Deployment documentation
│   ├── index.md                     # Deployment documentation index
│   ├── environments.md              # Environment configurations
│   ├── ci-cd-pipeline/              # CI/CD documentation
│   │   ├── index.md                 # CI/CD overview
│   │   ├── workflow-configuration.md # GitHub Actions workflow configuration
│   │   ├── auto-merge-guide.md      # Auto-merge implementation guide
│   │   └── pipeline-explanation.md  # Pipeline explanation
│   └── release-process.md           # Release process documentation
└── contributing/                    # Contribution guidelines
    ├── index.md                     # Contributing overview
    ├── code-review-process.md       # Code review guidelines
    ├── pull-request-template.md     # PR template and guidelines
    └── issue-template.md            # Issue template and guidelines
```

## Detailed Implementation Plan

### Phase 1: Create Base Directory Structure and Index Files

1. **Create New Directories**

```bash
# Create main directories
mkdir -p docs/architecture
mkdir -p docs/design/style-guide/assets
mkdir -p docs/design/wireframes
mkdir -p docs/design/features/chat-assistant
mkdir -p docs/design/features/menu
mkdir -p docs/design/features/reservation
mkdir -p docs/development/house-cleaning
mkdir -p docs/testing/unit-testing
mkdir -p docs/testing/e2e-testing
mkdir -p docs/deployment/ci-cd-pipeline
mkdir -p docs/contributing
```

2. **Create Index Files**

Create the following index files with basic content:

- `docs/index.md` (Main index)
- `docs/architecture/index.md`
- `docs/design/index.md`
- `docs/design/style-guide/index.md`
- `docs/design/wireframes/index.md`
- `docs/design/features/index.md`
- `docs/development/index.md`
- `docs/development/house-cleaning/index.md`
- `docs/testing/index.md`
- `docs/testing/unit-testing/index.md`
- `docs/testing/e2e-testing/index.md`
- `docs/deployment/index.md`
- `docs/deployment/ci-cd-pipeline/index.md`
- `docs/contributing/index.md`

### Phase 2: File Migration and Reorganization

#### Architecture Documentation

1. **Migrate High-Level Documentation**

```bash
# Move high-level documentation
cp /Users/admin/CascadeProjects/little-lemon/docs/high-level/app-architecture-map.md /Users/admin/CascadeProjects/little-lemon/docs/architecture/high-level-overview.md
cp /Users/admin/CascadeProjects/little-lemon/docs/high-level/project-structure.md /Users/admin/CascadeProjects/little-lemon/docs/architecture/project-structure.md
```

2. **Create Component Architecture Document**

Create a new file: `docs/architecture/component-architecture.md`

#### Design Documentation

1. **Migrate Style Guide**

```bash
# Move style guide documentation
cp /Users/admin/CascadeProjects/little-lemon/docs/ui-style/style-guide.md /Users/admin/CascadeProjects/little-lemon/docs/design/style-guide/index.md
cp /Users/admin/CascadeProjects/little-lemon/docs/ui-style/ui-kit-1.svg /Users/admin/CascadeProjects/little-lemon/docs/design/style-guide/assets/
cp /Users/admin/CascadeProjects/little-lemon/docs/ui-style/ui-kit.jpg /Users/admin/CascadeProjects/little-lemon/docs/design/style-guide/assets/
```

2. **Migrate Wireframes**

```bash
# Move wireframe documentation
cp -r /Users/admin/CascadeProjects/little-lemon/docs/wire-frame/images/* /Users/admin/CascadeProjects/little-lemon/docs/design/wireframes/images/
cp /Users/admin/CascadeProjects/little-lemon/docs/wire-frame/little-lemon-wireframe.png /Users/admin/CascadeProjects/little-lemon/docs/design/wireframes/
cp /Users/admin/CascadeProjects/little-lemon/docs/wire-frame/little-lemon-wireframe-setup.png /Users/admin/CascadeProjects/little-lemon/docs/design/wireframes/
```

3. **Migrate Feature Design Documentation**

```bash
# Move chat feature documentation
cp /Users/admin/CascadeProjects/little-lemon/docs/design/chat-feature/ai-chat-feature.md /Users/admin/CascadeProjects/little-lemon/docs/design/features/chat-assistant/
cp /Users/admin/CascadeProjects/little-lemon/docs/design/chat-feature/ai_chat_assistant_plan.md /Users/admin/CascadeProjects/little-lemon/docs/design/features/chat-assistant/
cp /Users/admin/CascadeProjects/little-lemon/docs/design/chat-feature/ai_integration_strategy.md /Users/admin/CascadeProjects/little-lemon/docs/design/features/chat-assistant/

# Move menu documentation
cp /Users/admin/CascadeProjects/little-lemon/docs/design/menu/menu_implementation_plan.md /Users/admin/CascadeProjects/little-lemon/docs/design/features/menu/

# Move main components documentation
cp /Users/admin/CascadeProjects/little-lemon/docs/design/main-components/main_content_proposal.md /Users/admin/CascadeProjects/little-lemon/docs/design/features/
```

#### Development Documentation

1. **Create Development Guides**

Create the following files:
- `docs/development/getting-started.md`
- `docs/development/coding-standards.md`
- `docs/development/component-guidelines.md`
- `docs/development/mobile-optimization.md`

2. **Migrate House Cleaning Documentation**

```bash
# Move house cleaning documentation
cp /Users/admin/CascadeProjects/little-lemon/docs/house-cleaning/project-house-cleaning.md /Users/admin/CascadeProjects/little-lemon/docs/development/house-cleaning/
cp /Users/admin/CascadeProjects/little-lemon/docs/house-cleaning/post-cleanup-action-plan.md /Users/admin/CascadeProjects/little-lemon/docs/development/house-cleaning/
cp /Users/admin/CascadeProjects/little-lemon/docs/house-cleaning/common-components-analysis.md /Users/admin/CascadeProjects/little-lemon/docs/development/house-cleaning/

# Create phase logs (if not gitignored)
cp /Users/admin/CascadeProjects/little-lemon/docs/logs/2025-05-29_house-cleaning-phase1-log.md /Users/admin/CascadeProjects/little-lemon/docs/development/house-cleaning/phase1-log.md
cp /Users/admin/CascadeProjects/little-lemon/docs/logs/2025-05-30_house-cleaning-phase2-log.md /Users/admin/CascadeProjects/little-lemon/docs/development/house-cleaning/phase2-log.md
```

#### Testing Documentation

1. **Migrate Testing Documentation**

```bash
# Move testing documentation
cp /Users/admin/CascadeProjects/little-lemon/docs/testing/playwright-little-lemon-config.md /Users/admin/CascadeProjects/little-lemon/docs/testing/e2e-testing/playwright-setup.md
cp /Users/admin/CascadeProjects/little-lemon/docs/testing/playwright-main-principles.md /Users/admin/CascadeProjects/little-lemon/docs/testing/testing-strategy.md
cp /Users/admin/CascadeProjects/little-lemon/docs/testing/unit-test/reservation-testing-guide.md /Users/admin/CascadeProjects/little-lemon/docs/testing/unit-testing/component-testing.md
```

2. **Create Additional Testing Documentation**

Create the following files:
- `docs/testing/unit-testing/hooks-testing.md`
- `docs/testing/e2e-testing/test-scenarios.md`

#### Deployment Documentation

1. **Migrate CI/CD Documentation**

```bash
# Move CI/CD documentation
cp /Users/admin/CascadeProjects/little-lemon/docs/ci-cd-pipeline/auto-merge-implementation-guide.md /Users/admin/CascadeProjects/little-lemon/docs/deployment/ci-cd-pipeline/auto-merge-guide.md
cp /Users/admin/CascadeProjects/little-lemon/docs/ci-cd-pipeline/auto-merge-pipeline-explanation.md /Users/admin/CascadeProjects/little-lemon/docs/deployment/ci-cd-pipeline/pipeline-explanation.md
cp /Users/admin/CascadeProjects/little-lemon/docs/ci-cd-pipeline/gemini-ci-cd.md /Users/admin/CascadeProjects/little-lemon/docs/deployment/ci-cd-pipeline/workflow-configuration.md
```

2. **Create Additional Deployment Documentation**

Create the following files:
- `docs/deployment/environments.md`
- `docs/deployment/release-process.md`

#### Contributing Documentation

Create the following files:
- `docs/contributing/code-review-process.md`
- `docs/contributing/pull-request-template.md`
- `docs/contributing/issue-template.md`

### Phase 3: Update Internal References and Links

1. **Update Main Index**

Update `docs/index.md` to include links to all main sections and important documents.

2. **Update README References**

Update any references in the README.md file to point to the new documentation structure.

3. **Update Internal Links**

Scan all documentation files for internal links and update them to point to the new locations.

### Phase 4: Cleanup

1. **Remove Old Directories**

After confirming all content has been successfully migrated and updated:

```bash
# Remove old directories (only after confirming successful migration)
rm -rf /Users/admin/CascadeProjects/little-lemon/docs/high-level
rm -rf /Users/admin/CascadeProjects/little-lemon/docs/ui-style
rm -rf /Users/admin/CascadeProjects/little-lemon/docs/wire-frame
# Keep house-cleaning, ci-cd-pipeline, etc. until all files are confirmed migrated
```

2. **Verify Documentation**

- Check all links work correctly
- Ensure all documentation is accessible from the main index
- Verify formatting is consistent across all documents

## Documentation Templates

### Index File Template

```markdown
# [Section Name] Documentation

## Overview

[Brief description of this documentation section]

## Contents

- [Document 1](./document1.md) - [Brief description]
- [Document 2](./document2.md) - [Brief description]
- [Subsection](./subsection/) - [Brief description]

## Recent Updates

- **YYYY-MM-DD**: [Update description]
- **YYYY-MM-DD**: [Update description]
```

### Standard Document Template

```markdown
# [Document Title]

## Overview

[Brief description of the document's purpose and content]

## [Section 1]

[Content for section 1]

## [Section 2]

[Content for section 2]

## Related Documentation

- [Related Document 1](../path/to/document1.md)
- [Related Document 2](../path/to/document2.md)

---

Last updated: YYYY-MM-DD
```

## Success Criteria

The documentation restructuring will be considered successful when:

1. All documentation is organized according to the proposed structure
2. All index files are created and populated with appropriate content
3. All internal links are updated to point to the correct locations
4. The main index provides clear navigation to all documentation sections
5. Documentation follows consistent formatting and naming conventions
6. No orphaned or unreferenced documentation exists

## Next Steps After Restructuring

1. **Documentation Review**
   - Review all documentation for accuracy and completeness
   - Identify gaps in documentation and create tasks to address them

2. **Documentation Standards**
   - Create a documentation standards guide
   - Implement a documentation review process

3. **Automation**
   - Consider implementing documentation generation tools
   - Set up automated checks for broken links and formatting issues

## Implementation Timeline

- **Phase 1 (Directory Structure)**: 1 day
- **Phase 2 (File Migration)**: 2-3 days
- **Phase 3 (Update References)**: 1-2 days
- **Phase 4 (Cleanup)**: 1 day

Total estimated time: 5-7 days

---

This implementation plan was created on 2025-05-30 and aligns with industry standards for technical documentation organization.
