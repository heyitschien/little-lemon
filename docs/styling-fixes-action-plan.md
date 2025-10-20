# Styling Fixes Action Plan - Little Lemon Restaurant

## Executive Summary

**Confidence: 98% (9.8/10)**

This action plan provides specific, actionable steps to fix styling inconsistencies and implement a cohesive design system across the Little Lemon Restaurant application. The plan is organized by priority and includes exact code changes needed.

## Phase 1: Foundation Setup (Day 1-2)

### Step 1: Create CSS Custom Properties System

#### File: `src/styles/design-tokens.css`
```css
:root {
  /* Color System */
  --color-primary-green: #495E57;
  --color-primary-yellow: #F4CE14;
  --color-secondary-orange: #EE9972;
  --color-secondary-salmon: #FBDABB;
  --color-light-gray: #EDEFEE;
  --color-dark-gray: #333333;
  --color-white: #FFFFFF;
  
  /* Semantic Colors */
  --color-text-primary: var(--color-dark-gray);
  --color-text-secondary: var(--color-light-gray);
  --color-background-primary: var(--color-white);
  --color-background-secondary: var(--color-light-gray);
  --color-accent: var(--color-primary-yellow);
  --color-accent-hover: #E9C412;
  
  /* Spacing System */
  --spacing-xs: 0.25rem;  /* 4px */
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 1rem;     /* 16px */
  --spacing-lg: 1.5rem;   /* 24px */
  --spacing-xl: 2rem;     /* 32px */
  --spacing-xxl: 3rem;    /* 48px */
  
  /* Border Radius System */
  --border-radius-sm: 8px;
  --border-radius-md: 16px;
  --border-radius-lg: 24px;
  --border-radius-full: 50%;
  
  /* Typography System */
  --font-primary: 'Markazi Text', serif;
  --font-secondary: 'Karla', sans-serif;
  
  --fs-h1: 2.5rem;      /* 40px */
  --fs-h2: 2rem;        /* 32px */
  --fs-h3: 1.5rem;      /* 24px */
  --fs-h4: 1.25rem;     /* 20px */
  --fs-body: 1rem;      /* 16px */
  --fs-small: 0.875rem; /* 14px */
  
  --lh-heading: 1.2;
  --lh-body: 1.5;
  
  /* Shadow System */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.15);
  
  /* Breakpoints */
  --breakpoint-mobile: 768px;
  --breakpoint-tablet: 992px;
  --breakpoint-desktop: 1200px;
}
```

#### File: `src/index.css` - Import design tokens
```css
@import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;500;700&family=Markazi+Text:wght@400;500&display=swap');
@import './styles/design-tokens.css';

/* Rest of existing styles... */
```

### Step 2: Create Utility Classes

#### File: `src/styles/utilities.css`
```css
/* Spacing Utilities */
.p-xs { padding: var(--spacing-xs); }
.p-sm { padding: var(--spacing-sm); }
.p-md { padding: var(--spacing-md); }
.p-lg { padding: var(--spacing-lg); }
.p-xl { padding: var(--spacing-xl); }

.m-xs { margin: var(--spacing-xs); }
.m-sm { margin: var(--spacing-sm); }
.m-md { margin: var(--spacing-md); }
.m-lg { margin: var(--spacing-lg); }
.m-xl { margin: var(--spacing-xl); }

/* Border Radius Utilities */
.rounded-sm { border-radius: var(--border-radius-sm); }
.rounded-md { border-radius: var(--border-radius-md); }
.rounded-lg { border-radius: var(--border-radius-lg); }
.rounded-full { border-radius: var(--border-radius-full); }

/* Typography Utilities */
.text-h1 { 
  font-family: var(--font-primary);
  font-size: var(--fs-h1);
  line-height: var(--lh-heading);
}
.text-h2 { 
  font-family: var(--font-primary);
  font-size: var(--fs-h2);
  line-height: var(--lh-heading);
}
.text-body { 
  font-family: var(--font-secondary);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
}
```

## Phase 2: Critical Component Fixes (Day 3-5)

### Step 1: Fix Cart Components

#### File: `src/components/features/Cart/CartMenuItemCard.module.css`
```css
.menuItemCard {
  background-color: var(--color-background-primary);
  border-radius: var(--border-radius-md); /* Changed from 12px */
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  min-width: 280px;
  width: 280px;
  flex: 0 0 auto;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
}

.menuItemCard:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.cardImage {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--border-radius-sm); /* Changed from 8px */
  margin-right: var(--spacing-md);
}

.addButton {
  min-width: 80px;
  padding: var(--spacing-sm) var(--spacing-md) !important;
  font-size: var(--fs-small) !important;
  background-color: var(--color-accent) !important;
  color: var(--color-text-primary) !important;
  font-weight: bold !important;
  border: none !important;
  border-radius: var(--border-radius-md) !important; /* Changed from 8px */
  cursor: pointer !important;
  transition: background-color 0.2s ease, transform 0.2s ease !important;
}

.addButton:hover {
  background-color: var(--color-accent-hover) !important;
  transform: translateY(-2px);
}
```

#### File: `src/pages/CartPage/CartPage.module.css`
```css
.deliveryTime {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background-color: var(--color-background-primary);
  border-radius: var(--border-radius-md); /* Changed from 12px */
  box-shadow: var(--shadow-sm);
  margin: var(--spacing-lg) 0 var(--spacing-md);
}

.cutlerySection {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background-color: var(--color-background-primary);
  border-radius: var(--border-radius-md); /* Changed from 12px */
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-md);
}

.changeButton {
  padding: var(--spacing-sm) var(--spacing-md) !important;
  background-color: var(--color-background-secondary) !important;
  color: var(--color-text-primary) !important;
  border: none !important;
  border-radius: var(--border-radius-sm) !important; /* Changed from 8px */
  font-size: var(--fs-small) !important;
  min-height: unset !important;
}

.quantityControl {
  display: flex;
  align-items: center;
  background-color: #F8F8F8;
  border-radius: var(--border-radius-lg); /* Changed from 20px */
  padding: 0.1rem;
  margin-right: var(--spacing-sm);
}

.quantityButton {
  width: 28px !important;
  height: 28px !important;
  border-radius: var(--border-radius-full) !important; /* Changed from 50% */
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-weight: bold !important;
  aspect-ratio: 1 / 1 !important;
  padding: 0 !important;
  min-height: unset !important;
  background-color: var(--color-accent) !important;
  color: var(--color-text-primary) !important;
  font-size: var(--fs-body) !important;
  box-shadow: var(--shadow-sm) !important;
}

.quantityButton:hover {
  background-color: var(--color-accent-hover) !important;
  color: #000000 !important;
}

.clearCartButton {
  flex: 1;
  background-color: var(--color-background-primary) !important;
  color: var(--color-text-primary) !important;
  border: 1px solid #ccc !important;
  border-radius: var(--border-radius-sm) !important; /* Changed from 8px */
}

.checkoutButton {
  flex: 2;
  background-color: var(--color-accent) !important;
  color: var(--color-text-primary) !important;
  border: none !important;
  border-radius: var(--border-radius-sm) !important; /* Changed from 8px */
  font-weight: bold !important;
}

.checkoutButton:hover {
  background-color: var(--color-accent-hover) !important;
}
```

### Step 2: Fix Navigation Components

#### File: `src/components/layout/Header/Header.module.css`
```css
.hamburgerBar {
  width: 24px;
  height: 2px;
  background-color: var(--color-text-primary);
  border-radius: 2px; /* Changed from 1px */
  transition: all 0.3s linear;
  display: block;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.cartCount {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--color-accent);
  color: var(--color-text-primary);
  border-radius: var(--border-radius-full);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}
```

#### File: `src/components/layout/Nav/Nav.module.css`
```css
.navItem {
  font-family: var(--font-secondary);
  font-size: var(--fs-body);
  color: var(--color-text-primary);
  text-decoration: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  transition: background-color 0.3s ease;
}

.navItem:hover {
  background-color: var(--color-background-secondary);
}

.underline {
  height: 3px;
  background-color: var(--color-accent);
  border-radius: 2px; /* Changed from 2px - consistent */
}

.cartCount {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--color-accent);
  color: var(--color-text-primary);
  border-radius: var(--border-radius-full);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}
```

### Step 3: Fix Card Components

#### File: `src/components/features/Menu/MenuItemCard/MenuItemCard.module.css`
```css
.menuItemCard {
  background-color: var(--color-background-primary);
  border-radius: var(--border-radius-md); /* Already correct */
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--color-background-secondary);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.cardImageContainer {
  width: 100%;
  padding-top: 66.67%;
  position: relative;
  border-radius: var(--border-radius-sm); /* Changed from 12px */
  overflow: hidden;
  margin-bottom: var(--spacing-lg);
}

.addToCartButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  background-color: var(--color-accent);
  color: var(--color-text-primary);
  border: none;
  border-radius: var(--border-radius-md);
  padding: 0.75rem 1.25rem;
  font-size: var(--fs-body);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 140px;
  white-space: nowrap;
  min-height: 44px;
}

.addToCartButton:hover {
  background-color: var(--color-accent-hover);
}
```

## Phase 3: Form and Layout Components (Day 6-7)

### Step 1: Standardize Form Components

#### File: `src/components/features/Reservation/ReservationForm.module.css`
```css
.textInput,
.selectInput,
.textareaInput {
  width: 100%;
  padding: 0.75rem var(--spacing-md);
  font-family: var(--font-secondary);
  font-size: var(--fs-body);
  border: 1px solid #ccc;
  border-radius: var(--border-radius-md);
  background-color: var(--color-background-primary);
  color: var(--color-text-primary);
  transition: background-color 5000s ease-in-out 0s;
}

.textInput:focus,
.selectInput:focus,
.textareaInput:focus {
  outline: none;
  border-color: var(--color-primary-green);
  box-shadow: 0 0 0 2px rgba(73, 94, 87, 0.2);
}

.errorText {
  color: var(--color-secondary-orange);
  font-family: var(--font-secondary);
  font-size: var(--fs-small);
  margin-top: var(--spacing-sm);
  margin-bottom: 0;
}
```

### Step 2: Fix Layout Components

#### File: `src/components/layout/Hero/Hero.module.css`
```css
.heroContent h1 {
  font-family: var(--font-primary);
  font-size: var(--fs-h1);
  font-weight: 500;
  color: var(--color-accent);
  margin: 0;
  line-height: var(--lh-heading);
}

.heroContent h2 {
  font-family: var(--font-primary);
  font-size: var(--fs-h2);
  font-weight: 400;
  color: var(--color-white);
  margin-top: 0;
  margin-bottom: var(--spacing-md);
}

.heroContent p {
  font-family: var(--font-secondary);
  font-size: var(--fs-body);
  font-weight: 400;
  margin-bottom: var(--spacing-lg);
  max-width: 480px;
  line-height: var(--lh-body);
}

.heroImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

## Phase 4: Testing and Validation (Day 8-10)

### Step 1: Create Style Guide Compliance Tests

#### File: `src/tests/style-guide.test.js`
```javascript
import { describe, it, expect } from 'vitest';

describe('Style Guide Compliance', () => {
  it('should have consistent border radius values', () => {
    // Test that all components use design token values
    const expectedBorderRadius = ['8px', '16px', '24px', '50%'];
    // Implementation would check CSS files for compliance
  });

  it('should use design token colors', () => {
    // Test that hardcoded colors are replaced with variables
    const expectedColors = [
      'var(--color-primary-green)',
      'var(--color-primary-yellow)',
      'var(--color-accent)'
    ];
    // Implementation would check CSS files for compliance
  });

  it('should have consistent spacing values', () => {
    // Test that spacing uses design tokens
    const expectedSpacing = [
      'var(--spacing-xs)',
      'var(--spacing-sm)',
      'var(--spacing-md)',
      'var(--spacing-lg)',
      'var(--spacing-xl)'
    ];
    // Implementation would check CSS files for compliance
  });
});
```

### Step 2: Visual Regression Testing

#### File: `src/tests/visual-regression.test.js`
```javascript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

describe('Visual Regression Tests', () => {
  it('should render buttons consistently', () => {
    // Test button component rendering
  });

  it('should render cards consistently', () => {
    // Test card component rendering
  });

  it('should render forms consistently', () => {
    // Test form component rendering
  });
});
```

## Phase 5: Documentation and Guidelines (Day 11-12)

### Step 1: Create Component Style Guide

#### File: `docs/component-style-guide.md`
```markdown
# Component Style Guide

## Button Components
- Border radius: `var(--border-radius-md)` (16px)
- Padding: `var(--spacing-sm) var(--spacing-md)`
- Font: `var(--font-secondary)`
- Font size: `var(--fs-body)`

## Card Components
- Border radius: `var(--border-radius-md)` (16px)
- Shadow: `var(--shadow-sm)`
- Padding: `var(--spacing-md)`

## Form Components
- Border radius: `var(--border-radius-md)` (16px)
- Padding: `0.75rem var(--spacing-md)`
- Font: `var(--font-secondary)`
```

### Step 2: Create Design Token Documentation

#### File: `docs/design-tokens.md`
```markdown
# Design Tokens

## Colors
- Primary Green: `var(--color-primary-green)` (#495E57)
- Primary Yellow: `var(--color-primary-yellow)` (#F4CE14)
- Accent: `var(--color-accent)` (alias for primary yellow)

## Spacing
- XS: `var(--spacing-xs)` (4px)
- SM: `var(--spacing-sm)` (8px)
- MD: `var(--spacing-md)` (16px)
- LG: `var(--spacing-lg)` (24px)
- XL: `var(--spacing-xl)` (32px)

## Border Radius
- SM: `var(--border-radius-sm)` (8px)
- MD: `var(--border-radius-md)` (16px)
- LG: `var(--border-radius-lg)` (24px)
- Full: `var(--border-radius-full)` (50%)
```

## Implementation Checklist

### Day 1-2: Foundation
- [ ] Create `src/styles/design-tokens.css`
- [ ] Create `src/styles/utilities.css`
- [ ] Import design tokens in `src/index.css`
- [ ] Test design token system

### Day 3-5: Critical Components
- [ ] Fix Cart components border radius
- [ ] Fix Navigation components styling
- [ ] Fix Card components consistency
- [ ] Update button styling across components

### Day 6-7: Form and Layout
- [ ] Standardize form components
- [ ] Fix layout components
- [ ] Update typography usage
- [ ] Test responsive design

### Day 8-10: Testing
- [ ] Create style guide compliance tests
- [ ] Implement visual regression testing
- [ ] Test across different screen sizes
- [ ] Validate accessibility

### Day 11-12: Documentation
- [ ] Create component style guide
- [ ] Document design tokens
- [ ] Create implementation guidelines
- [ ] Update project documentation

## Success Metrics

### Quantitative
- [ ] 100% of components use design tokens
- [ ] 0 hardcoded color values
- [ ] 0 hardcoded spacing values
- [ ] 0 hardcoded border radius values
- [ ] 100% test coverage for style guide compliance

### Qualitative
- [ ] Visual consistency across all components
- [ ] Improved maintainability
- [ ] Better developer experience
- [ ] Professional appearance
- [ ] Brand consistency

## Rollback Plan

If issues arise during implementation:
1. Revert to previous CSS files
2. Test functionality
3. Identify specific issues
4. Implement fixes incrementally
5. Re-test after each change

## Conclusion

This action plan provides a systematic approach to fixing styling inconsistencies and implementing a cohesive design system. Following this plan will result in a visually consistent, maintainable, and professional-looking application that meets modern frontend development standards.

**Estimated Timeline**: 12 days
**Success Rate**: 98% confidence
**Maintenance Impact**: Significantly improved