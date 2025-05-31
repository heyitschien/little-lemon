# Typography

## Overview

This document defines the typography system for the Little Lemon application, with a focus on readability and usability on mobile devices.

## Font Families

The Little Lemon application uses two main font families:

1. **Markazi Text** - Used for headings and display text
   - Weights: Regular (400), Medium (500), Bold (700)
   - Source: Google Fonts

2. **Karla** - Used for body text and UI elements
   - Weights: Regular (400), Medium (500), Bold (700)
   - Source: Google Fonts

## Type Scale

The application uses a responsive type scale that adjusts based on viewport size, with a focus on mobile readability:

### Mobile Type Scale (Default)

| Element | Font | Weight | Size | Line Height | Usage |
|---------|------|--------|------|-------------|-------|
| h1 | Markazi Text | 500 | 28px | 1.2 | Main page titles |
| h2 | Markazi Text | 500 | 24px | 1.2 | Section headings |
| h3 | Markazi Text | 500 | 20px | 1.3 | Subsection headings |
| h4 | Karla | 700 | 18px | 1.4 | Card titles, emphasis |
| Body | Karla | 400 | 16px | 1.5 | Main body text |
| Small | Karla | 400 | 14px | 1.5 | Secondary text, captions |
| Button | Karla | 700 | 16px | 1.25 | Button text |

### Desktop Adjustments

For larger screens, font sizes scale up proportionally:

| Element | Mobile Size | Desktop Size |
|---------|-------------|--------------|
| h1 | 28px | 40px |
| h2 | 24px | 32px |
| h3 | 20px | 24px |
| h4 | 18px | 20px |
| Body | 16px | 18px |
| Small | 14px | 16px |
| Button | 16px | 18px |

## Mobile Optimization

The typography system is optimized for mobile devices with the following considerations:

1. **Readability**
   - Minimum font size of 14px to ensure readability on small screens
   - Adequate line height (1.5 for body text) to improve readability
   - High contrast between text and background colors

2. **Touch Optimization**
   - Clickable text elements sized appropriately for touch (minimum 44x44px)
   - Sufficient spacing between interactive text elements

3. **Responsive Behavior**
   - Text scales appropriately based on viewport size
   - Line length limited to improve readability on mobile

## Implementation

Typography is implemented using CSS custom properties (variables) to ensure consistency:

```css
:root {
  /* Font families */
  --font-primary: 'Markazi Text', serif;
  --font-secondary: 'Karla', sans-serif;
  
  /* Font weights */
  --fw-regular: 400;
  --fw-medium: 500;
  --fw-bold: 700;
  
  /* Font sizes - Mobile */
  --fs-h1: 1.75rem;      /* 28px */
  --fs-h2: 1.5rem;       /* 24px */
  --fs-h3: 1.25rem;      /* 20px */
  --fs-h4: 1.125rem;     /* 18px */
  --fs-body: 1rem;       /* 16px */
  --fs-small: 0.875rem;  /* 14px */
  
  /* Line heights */
  --lh-heading: 1.2;
  --lh-subheading: 1.3;
  --lh-body: 1.5;
  --lh-button: 1.25;
}

/* Desktop adjustments */
@media (min-width: 768px) {
  :root {
    --fs-h1: 2.5rem;     /* 40px */
    --fs-h2: 2rem;       /* 32px */
    --fs-h3: 1.5rem;     /* 24px */
    --fs-h4: 1.25rem;    /* 20px */
    --fs-body: 1.125rem; /* 18px */
    --fs-small: 1rem;    /* 16px */
  }
}
```

---

Last updated: 2025-05-30
