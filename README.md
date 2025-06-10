# Little Lemon Restaurant - Meta Front-End Capstone Project

![Reservation Flow Coverage](https://img.shields.io/badge/Reservation%20Flow%20Coverage-100%25-brightgreen)

## Project Overview
This is the capstone project for the Meta Front-End Developer Professional Certificate program. The Little Lemon web application is a responsive React-based solution for a fictional Mediterranean restaurant, focusing on improving the user experience for table reservations.

## For Peer Reviewers

Welcome to my Little Lemon Restaurant project! This guide will help you navigate the project and evaluate it according to the required criteria.

### Getting Started

1. **Clone the repository**:
   ```
   git clone https://github.com/heyitschien/little-lemon.git
   cd little-lemon
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000)

### Evaluation Criteria Guide

#### 1. UX/UI Design Implementation
The application follows the Little Lemon brand guidelines with a responsive design that works on mobile, tablet, and desktop devices.

**Key pages to review:**
- Home page: `/`
- About page: `/about`
- Menu page: `/menu`
- **Reservations page**: `/reservations` (primary focus of the project)
- My Reservations page: `/my-reservations`

#### 2. Accessibility Features
The application implements accessibility best practices:
- Semantic HTML5 elements (header, nav, main, section, footer)
- ARIA attributes for interactive elements
- Keyboard navigation support (try tabbing through the reservation form)
- Color contrast compliance for text readability
- Alt text for all images

**Key files to check:**
- `src/components/layout/Header/Header.jsx`
- `src/components/features/Reservation/ReservationForm.jsx`

#### 3. Unit Testing
The project includes comprehensive unit tests for the reservation functionality, which is the core business logic of the application.

![Reservation Flow Coverage](https://img.shields.io/badge/Reservation%20Flow%20Coverage-100%25-brightgreen)
![Overall Coverage](https://img.shields.io/badge/Overall%20Coverage-33.5%25-yellow)

**Available Test Commands:**

```bash
# Run all tests
npm test

# Run tests with interactive UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Generate detailed coverage report
npm run coverage:report

# Run tests with coverage in UI mode
npm run coverage:ui
```

**Viewing Test Coverage:**
After running `npm run coverage:report`, you can view the detailed HTML coverage report by opening the generated files in the `coverage` directory.

**Key test files to review:**
- `src/components/features/Reservation/ReservationForm.test.jsx`
- `src/components/features/Reservation/DateTimeSelector.test.jsx`
- `src/components/features/Reservation/ReservationConfirmation.test.jsx`
- `src/components/features/Reservation/ReservationList.test.jsx`
- `src/hooks/useReservation.test.js`
- `src/services/reservationService.test.js`

**Reservation Flow Coverage Details:**

| Component/Module | Statements | Branches | Functions | Lines |
|-----------------|------------|----------|-----------|-------|
| Reservation Components | 100% | 95.76% | 100% | 100% |
| useReservation Hook | 97.66% | 89.47% | 100% | 97.66% |
| Reservation Service | 97.35% | 96.87% | 90.9% | 97.35% |

**Testing Strategy:**
The testing approach focuses on the core reservation flow, which is the primary feature of this capstone project. This targeted strategy ensures that the most critical business logic is thoroughly tested while demonstrating proficiency in React testing practices.

#### 4. Booking Form Functionality
The reservation booking form is the main feature of this project.

**To test the form:**
1. Navigate to `/reservations`
2. Try submitting the form without filling required fields (validation should trigger)
3. Complete the form with valid information
4. Check the confirmation screen after submission

**Form features:**
- Interactive date and time selection
- Party size selection with validation
- Contact information fields with validation
- Form submission with confirmation

#### 5. Semantics and Responsiveness

**To test responsiveness:**
1. Use browser dev tools to view the site in different screen sizes
2. Check how the navigation, reservation form, and other components adapt

**Implementation details:**
- Semantic HTML5 elements throughout the codebase
- CSS modules for component-specific styling
- Media queries for responsive design
- Flexible layouts using CSS Grid and Flexbox

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI elements
│   ├── features/
│   │   └── Reservation/ # Reservation form components
│   └── layout/          # Header, Footer, Navigation
├── hooks/               # Custom React hooks
├── pages/               # Page components
│   └── ReservationPage/ # Main reservation page
└── services/            # API services
```

## Technology Stack
- React
- CSS Modules
- React Router
- Context API for state management

## Developer
- Chien Escalera Duong
- June 2025

## Development Setup
This project uses modern development tools for a professional React application.

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Repository Information
This project is maintained in a Git repository, making it easy to track changes and collaborate with other developers.

## Peer Review Checklist

When reviewing this project, please consider the following criteria:

1. **UX/UI Implementation**
   - Does the application follow the Little Lemon brand guidelines?
   - Is the design responsive across different device sizes?

2. **Accessibility**
   - Are semantic HTML elements used appropriately?
   - Do interactive elements have proper ARIA attributes?
   - Can the application be navigated using a keyboard?

3. **Unit Testing**
   - Do the tests cover critical functionality?
   - Do all tests pass when running `npm test`?

4. **Booking Form**
   - Does the form validate user inputs correctly?
   - Is the form submission process clear and functional?
   - Does the form provide appropriate feedback?

5. **Semantics and Responsiveness**
   - Does the application render correctly on different screen sizes?
   - Is the HTML structure semantic and well-organized?

Thank you for taking the time to review this project!
