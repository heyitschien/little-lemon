# Coding Standards

## Overview

This document outlines the coding standards and conventions for the Little Lemon project. Following these standards ensures consistency, maintainability, and quality across the codebase.

## JavaScript/React Standards

### File Organization

- One component per file
- Use PascalCase for component files (e.g., `MenuItemCard.jsx`)
- Use camelCase for utility files (e.g., `formatDate.js`)
- Group related files in directories

### Component Structure

```jsx
// Imports
import React from 'react';
import PropTypes from 'prop-types';
import styles from './ComponentName.module.css';

// Component definition
const ComponentName = ({ prop1, prop2 }) => {
  // State and hooks
  const [state, setState] = useState(initialState);
  
  // Event handlers and other functions
  const handleEvent = () => {
    // ...
  };
  
  // JSX
  return (
    <div className={styles.container}>
      {/* Component content */}
    </div>
  );
};

// PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

// Default props
ComponentName.defaultProps = {
  prop2: 0,
};

// Export
export default ComponentName;
```

### Naming Conventions

- **Components**: PascalCase (e.g., `MenuItemCard`)
- **Functions**: camelCase (e.g., `handleSubmit`)
- **Variables**: camelCase (e.g., `menuItems`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_ITEMS`)
- **CSS Classes**: camelCase or kebab-case (e.g., `menuItem` or `menu-item`)

### Code Formatting

- Use Prettier for consistent formatting
- 2-space indentation
- Single quotes for strings
- Semicolons at the end of statements
- No trailing commas
- Maximum line length of 80 characters

### Best Practices

- Use functional components with hooks
- Destructure props and state
- Use prop-types for type checking
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use meaningful variable and function names
- Add comments for complex logic

## CSS Standards

### File Organization

- Use CSS modules for component-specific styles
- Name CSS module files to match component files (e.g., `ComponentName.module.css`)

### Naming Conventions

- Use camelCase for class names in CSS modules
- Use BEM-like naming for related elements (e.g., `card`, `cardTitle`, `cardDescription`)

### Best Practices

- Use CSS variables for colors, spacing, and typography
- Follow mobile-first approach
- Use relative units (rem, em, %) instead of fixed units (px)
- Group related properties
- Avoid deep nesting
- Minimize use of !important

## Mobile-First Development

Since the Little Lemon application is primarily focused on mobile:

1. **Start with mobile layouts**
   - Design and implement for mobile first
   - Use media queries to enhance for larger screens

2. **Optimize for touch**
   - Ensure touch targets are at least 44x44px
   - Provide adequate spacing between interactive elements
   - Implement touch-friendly interactions

3. **Performance considerations**
   - Optimize images and assets
   - Minimize JavaScript execution time
   - Implement code splitting and lazy loading

## Git Commit Standards

Follow the Conventional Commits specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Performance improvements
- `test`: Adding or correcting tests
- `chore`: Changes to the build process or auxiliary tools

Example:
```
feat(menu): Add filtering by dietary restrictions

- Added vegetarian filter
- Added vegan filter
- Added gluten-free filter

Closes #123
```

## Code Review Process

All code should be reviewed before merging:

1. **Functionality**: Does the code work as expected?
2. **Code quality**: Does the code follow our standards?
3. **Performance**: Is the code optimized, especially for mobile?
4. **Accessibility**: Does the code meet accessibility standards?
5. **Testing**: Is the code adequately tested?

---

Last updated: 2025-05-30
