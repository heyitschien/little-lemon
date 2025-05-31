# Component Guidelines

## Overview

This document provides guidelines for developing components in the Little Lemon application, with a focus on creating maintainable, reusable, and mobile-optimized components.

## Component Organization

Components are organized into three main categories:

1. **Layout Components** (`src/components/layout/`)
   - Components that define the structure of the application
   - Examples: Header, Footer, Nav, Hero, MainComponent

2. **Feature Components** (`src/components/features/`)
   - Components specific to certain features
   - Examples: Menu, Reservation, ChatAssistant, About, Testimonials

3. **Common Components** (`src/components/common/`)
   - Reusable components used across multiple features
   - Examples: Button, Card, Input, Modal

## Component Structure

Each component should be structured as follows:

1. **Directory Structure**
   ```
   ComponentName/
   ├── ComponentName.jsx       # Component implementation
   ├── ComponentName.module.css # Component styles
   └── index.js                # Re-export (optional)
   ```

2. **Component Implementation**
   ```jsx
   import React from 'react';
   import PropTypes from 'prop-types';
   import styles from './ComponentName.module.css';

   const ComponentName = ({ prop1, prop2, children }) => {
     // Component implementation
     return (
       <div className={styles.container}>
         {children}
       </div>
     );
   };

   ComponentName.propTypes = {
     prop1: PropTypes.string.isRequired,
     prop2: PropTypes.number,
     children: PropTypes.node,
   };

   ComponentName.defaultProps = {
     prop2: 0,
     children: null,
   };

   export default ComponentName;
   ```

## Component Design Principles

### 1. Single Responsibility

Each component should have a single responsibility and do it well. If a component is doing too much, consider breaking it down into smaller components.

### 2. Reusability

Design components to be reusable whenever possible. Extract common patterns into shared components in the `common` directory.

### 3. Composability

Components should be composable, allowing them to be combined in different ways to create more complex UIs.

### 4. Prop Interface

Define a clear and consistent prop interface for each component:
- Use descriptive prop names
- Document props with PropTypes
- Provide default values for optional props
- Use consistent naming conventions

### 5. Mobile-First Design

All components should be designed with mobile as the primary target:
- Start with mobile layouts and progressively enhance for larger screens
- Ensure touch targets are at least 44x44px
- Optimize for performance on mobile devices
- Test on various mobile viewport sizes

## Common Component Guidelines

### Button Component

```jsx
<Button 
  variant="primary" 
  size="medium" 
  onClick={handleClick}
  disabled={false}
>
  Click Me
</Button>
```

- Variants: primary, secondary, text
- Sizes: small, medium, large
- Always include proper aria attributes
- Ensure adequate touch target size (minimum 44x44px)

### Card Component

```jsx
<Card
  title="Card Title"
  image="/path/to/image.jpg"
  imageAlt="Description of image"
  footer={<Button>Action</Button>}
>
  Card content goes here
</Card>
```

- Use consistent padding and spacing
- Support various content types
- Implement responsive behavior
- Optimize images for mobile

### Form Components

```jsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={handleChange}
  error={emailError}
  required
/>
```

- Always include labels
- Show validation errors clearly
- Support various input types
- Ensure adequate touch target size
- Implement mobile-friendly keyboard types

## Feature Component Guidelines

Feature components should:
1. Be organized by feature domain
2. Use common components whenever possible
3. Implement feature-specific business logic
4. Follow mobile-first design principles
5. Be well-documented with comments

## Layout Component Guidelines

Layout components should:
1. Be responsive and adapt to different screen sizes
2. Use flexible layouts (CSS Grid, Flexbox)
3. Implement consistent spacing and alignment
4. Consider mobile navigation patterns
5. Optimize for performance

## Performance Considerations

To ensure good performance, especially on mobile devices:

1. **Minimize Re-renders**
   - Use React.memo for pure components
   - Optimize dependency arrays in useEffect and useMemo
   - Use callback functions appropriately

2. **Optimize Assets**
   - Use responsive images
   - Implement lazy loading for images
   - Optimize SVGs and icons

3. **Code Splitting**
   - Use dynamic imports for large components
   - Implement lazy loading for routes

4. **Reduce Bundle Size**
   - Avoid unnecessary dependencies
   - Use tree-shaking friendly imports

## Accessibility Guidelines

All components should be accessible:

1. Use semantic HTML elements
2. Include proper ARIA attributes
3. Ensure keyboard navigability
4. Maintain adequate color contrast
5. Support screen readers
6. Test with accessibility tools

---

Last updated: 2025-05-30
