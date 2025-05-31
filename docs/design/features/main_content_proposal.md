# Proposal: Implementing Main Content Sections for Little Lemon Homepage

Date: May 21, 2025
Prepared for: Chien
Prepared by: Cascade (AI Assistant)

## 1. Introduction

This document outlines the strategy and plan for developing the main content sections of the Little Lemon restaurant homepage. The goal is to translate the provided HTML prototype (`docs/prototype/index.html`) into responsive React components, adhering to the project's established style guide, directory structure, and industry best practices.

We will implement the following four main sections:
1.  Hero Section
2.  "This Week's Specials" Section
3.  Testimonials Section
4.  About Section

## 2. Overall Strategy: Modular Component-Based Development

We will adopt a **section-by-section (modular) approach**. Each of the four main sections identified will be developed as a distinct React component with its own dedicated CSS Module for styling. This aligns with React's component-based architecture and offers several benefits:
-   **Manageability:** Simplifies development, styling, and testing.
-   **Isolation:** Makes debugging easier.
-   **Reusability:** Promotes the creation of smaller, potentially reusable UI elements (e.g., cards).
-   **Clarity:** Keeps the codebase organized and easier to understand.

The general workflow for each section will be:
1.  Create the React component file (e.g., `Hero.jsx`) and its CSS Module (e.g., `Hero.module.css`).
2.  Implement the HTML structure within the component based on the prototype.
3.  Apply styles using the CSS Module, referencing the Little Lemon style guide for colors, typography, and spacing.
4.  Ensure the layout is responsive using media queries, adapting to various screen sizes as indicated or implied by the prototype.
5.  Integrate the new section component into `src/components/MainComponent/MainComponent.jsx`.

## 3. Proposed Directory Structure

-   **Main Content Assembler:**
    -   `src/components/MainComponent/MainComponent.jsx`: This component will import and render the individual section components in the correct order.
-   **Section Components:**
    -   `src/components/Hero/Hero.jsx` & `Hero.module.css`
    -   `src/components/Specials/Specials.jsx` & `Specials.module.css`
    -   `src/components/Testimonials/Testimonials.jsx` & `Testimonials.module.css`
    -   `src/components/About/About.jsx` & `About.module.css`
-   **Reusable Sub-Components (to be created as needed):**
    -   `src/components/Specials/SpecialCard.jsx` & `SpecialCard.module.css` (for individual special items)
    -   `src/components/Testimonials/TestimonialCard.jsx` & `TestimonialCard.module.css` (for individual testimonials)
    -   A generic `Button.jsx` component might also be considered if button styles become highly repetitive, though the prototype uses simple classes for now.
-   **Assets:**
    -   Images (hero image, food images, testimonial avatars, about section images) should be placed in `public/assets/images/` for easy referencing.

### 3.1. Visual Directory Tree

The following tree illustrates the proposed structure within the `src` folder, including existing components and the new sections:

```
src/
├── assets/                                 // If importing images directly
│   └── images/
│       ├── (hero-image.jpg)                // Example placeholder
│       ├── (special-greek-salad.jpg)     // Example placeholder
│       ├── (testimonial-avatar1.jpg)     // Example placeholder
│       └── (about-image1.jpg)              // Example placeholder
├── components/
│   ├── About/                              // New Section
│   │   ├── About.jsx
│   │   └── About.module.css
│   ├── Footer/                             // Existing
│   │   ├── Footer.jsx
│   │   └── Footer.module.css
│   ├── Header/                             // Existing
│   │   ├── Header.jsx
│   │   └── Header.module.css
│   ├── Hero/                               // New Section
│   │   ├── Hero.jsx
│   │   └── Hero.module.css
│   ├── MainComponent/                      // Existing (will import new sections)
│   │   ├── MainComponent.jsx
│   │   └── MainComponent.module.css
│   ├── Nav/                                // Existing
│   │   ├── Nav.jsx
│   │   └── Nav.module.css
│   ├── Specials/                           // New Section
│   │   ├── Specials.jsx
│   │   ├── Specials.module.css
│   │   ├── SpecialCard.jsx               // New Sub-component
│   │   └── SpecialCard.module.css        // New Sub-component
│   └── Testimonials/                       // New Section
│       ├── Testimonials.jsx
│       ├── Testimonials.module.css
│       ├── TestimonialCard.jsx           // New Sub-component
│       └── TestimonialCard.module.css    // New Sub-component
├── App.css                                 // Existing
├── App.jsx                                 // Existing
└── main.jsx                                // Existing
```
*Note: The `public/assets/images/` path mentioned earlier is for static assets if not directly imported. If importing, `src/assets/images/` is common. The tree above shows `src/assets/images/` for illustration if that pattern is chosen for direct imports.* 

## 4. Section-by-Section Implementation Plan

### 4.1. Hero Section

-   **Component:** `Hero.jsx`, `Hero.module.css`
-   **Purpose:** To provide a compelling introduction to the restaurant, featuring a prominent call-to-action.
-   **Key Content Elements (from prototype `lines 80-124`):**
    -   Headline 1: "Little Lemon" (Color: `var(--primary-yellow)`)
    -   Headline 2: "Chicago" (Color: `white`)
    -   Paragraph: "We are a family owned Mediterranean restaurant..."
    -   Button: "Reserve a Table" (Style: `.btn-primary`)
    -   Image: Restaurant/food image on the right.
-   **Layout Strategy (Prototype uses CSS Grid):**
    -   A two-column layout: text content on the left, image on the right.
    -   The prototype uses `grid-template-columns: 1fr 1fr;` for `.hero-container`. We will replicate this.
    -   Vertical alignment: `align-items: center;`.
-   **Styling Notes:**
    -   Background: `var(--primary-green)`.
    -   Text Color: `white` (default), `var(--primary-yellow)` for H1.
    -   Typography: Markazi Text for headings, Karla for paragraph/button, as per style guide and prototype.
    -   Image: `border-radius: 16px;`, `object-fit: cover;`.
-   **Responsiveness:**
    -   On smaller screens, the two columns should stack vertically (image below text content). This will likely involve changing `grid-template-columns` to `1fr` in a media query.
-   **Data:** Static content directly in the JSX.

### 4.2. "This Week's Specials" Section

-   **Component:** `Specials.jsx`, `Specials.module.css`
-   **Sub-Component:** `SpecialCard.jsx`, `SpecialCard.module.css`
-   **Purpose:** To highlight featured dishes and encourage users to view the full menu.
-   **Key Content Elements (from prototype `lines 162-240`):**
    -   Section Title: "This Week's specials!"
    -   Button: "Online Menu" (Style: `.btn-secondary` or similar, prototype shows `.btn-primary` for the "Reserve Table" button. The prototype CSS for `.btn-secondary` is identical to `.btn-primary`. We can use this or define a distinct style if preferred).
    -   A grid of "Special Cards."
-   **Special Card Elements:**
    -   Image of the dish.
    -   Dish Title (e.g., "Greek Salad").
    -   Price (e.g., "$12.99", Color: `var(--secondary-orange)`).
    -   Description.
    -   "Order a delivery" link/button (with a delivery icon).
-   **Layout Strategy (Prototype uses CSS Grid):**
    -   `.specials-header`: `display: flex; justify-content: space-between; align-items: center;` for title and "Online Menu" button.
    -   `.specials-grid`: `grid-template-columns: repeat(3, 1fr);` for the cards.
-   **Styling Notes:**
    -   Section Background: Default page background (likely white or `--highlight-white`).
    -   Card Background: `var(--highlight-white)`.
    -   Card `border-radius: 16px;`.
    -   Typography and colors as per style guide and prototype.
-   **Responsiveness:**
    -   The 3-column grid for specials should adapt:
        -   Perhaps 2 columns on tablets.
        -   1 column on mobile, with cards stacking vertically.
-   **Data:**
    -   The special items (image path, title, price, description) should be represented as an array of objects.
    -   `Specials.jsx` will map over this array to render multiple `SpecialCard.jsx` components.

### 4.3. Testimonials Section

-   **Component:** `Testimonials.jsx`, `Testimonials.module.css`
-   **Sub-Component:** `TestimonialCard.jsx`, `TestimonialCard.module.css`
-   **Purpose:** To build trust and social proof by showcasing positive customer feedback.
-   **Key Content Elements (from prototype `lines 242-296`):**
    -   Section Title: "Testimonials" (Centered).
    -   A grid of "Testimonial Cards."
-   **Testimonial Card Elements:**
    -   Rating (e.g., stars - prototype shows `.testimonial-rating` but no specific star implementation. We can use text "Rating: X stars" or implement star icons).
    -   User Profile: Image (avatar) and Name.
    -   Testimonial Text (quote).
-   **Layout Strategy (Prototype uses CSS Grid):**
    -   `.testimonials-grid`: `grid-template-columns: repeat(4, 1fr);`.
-   **Styling Notes:**
    -   Section Background: `var(--highlight-white)`.
    -   Card Background: `white`.
    -   Card `border-radius: 16px;`.
    -   Avatar: `border-radius: 50%;`.
    -   Typography and colors as per style guide.
-   **Responsiveness:**
    -   The 4-column grid for testimonials should adapt:
        -   Perhaps 2 columns on tablets.
        -   1 column on mobile.
-   **Data:**
    -   Testimonial data (rating, image path, name, text) should be an array of objects.
    -   `Testimonials.jsx` will map over this array to render `TestimonialCard.jsx` components.

### 4.4. About Section

-   **Component:** `About.jsx`, `About.module.css`
-   **Purpose:** To provide more detailed information about the restaurant's story and ambiance.
-   **Key Content Elements (from prototype `lines 298-361`):**
    -   Headline 1: "Little Lemon" (Color: `var(--primary-green)`)
    -   Headline 2: "Chicago"
    -   Paragraphs: Detailed description of the restaurant.
    -   Two overlapping images on the right.
-   **Layout Strategy (Prototype uses CSS Grid and absolute positioning for images):**
    -   `.about-container`: `grid-template-columns: 1fr 1fr;` (text left, images right).
    -   `.about-images`: Uses `position: relative;` for the container, and `position: absolute;` for the two images to achieve the overlapping effect.
-   **Styling Notes:**
    -   Section Background: Default page background.
    -   Typography and colors as per style guide.
    -   Images: `border-radius: 16px;`.
-   **Responsiveness:**
    -   The two-column layout should stack on smaller screens (images likely below text).
    -   The overlapping image effect might need simplification or adjustment on very small screens to maintain clarity.
-   **Data:** Static content directly in the JSX.

## 5. Next Steps

1.  **Confirm Proposal:** User (Chien) to review and approve this plan.
2.  **Implementation:** Begin developing the sections one by one, starting with the Hero section.
    -   Create component files.
    -   Add HTML structure.
    -   Style with CSS Modules.
    -   Implement responsiveness.
    -   Integrate into `MainComponent.jsx`.
3.  **Asset Preparation:** Gather or prepare placeholder images for each section.
4.  **Iterative Review:** Review each section's appearance and functionality on different screen sizes.

This structured approach will ensure that the main content of the Little Lemon homepage is developed efficiently, adheres to design requirements, and results in a high-quality, responsive user experience.


