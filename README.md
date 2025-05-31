# Little Lemon Restaurant Web Application

## Project Overview
This is the capstone project for the Meta Front-End Developer Professional Certificate program. The Little Lemon web application is a responsive React-based solution for the fictional Mediterranean restaurant "Little Lemon", focusing on improving the user experience for table reservations.

## Project Information
- **Developer**: Chien
- **Project Start Date**: May 27, 2025
- **Current Status**: In Development - Post House Cleaning
- **Repository**: [github.com/heyitschien/little-lemon](https://github.com/heyitschien/little-lemon)
- **Environments**:
  - **Production**: [little-lemon.vercel.app](https://little-lemon.vercel.app) (main branch)
  - **Staging**: [little-lemon-staging.vercel.app](https://little-lemon-staging.vercel.app) (staging branch)

## Project Objectives
The main goal is to create a fully functional and user-friendly table reservation system that addresses previous user complaints about confusion, appearance, and functionality. The application will showcase skills learned throughout the Meta Front-End Developer program.

## Features
- Responsive design that works across devices
- Table reservation system with intuitive UI
- Form validation for user inputs
- Accessibility compliance
- Modern React component architecture

## Technology Stack
- **Frontend Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: CSS with responsive design principles
- **Version Control**: Git/GitHub
- **Code Quality**: ESLint and Prettier

## Development Setup
This project uses modern development tools optimized for AI-assisted development in Windsurf IDE.

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/heyitschien/meta-front-end.git

# Navigate to project directory
cd meta-front-end/courses/c8.capstone-project/little-lemon

# Install dependencies
npm install
```

### Available Scripts
```bash
# Start development server
npm run dev

# Check for linting issues
npm run lint

# Format code with Prettier
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

The project is organized to promote scalability, maintainability, and a clear separation of concerns. Below is a detailed overview of the directory structure and the purpose of each key folder and file.

```
little-lemon/
├── .gitignore            # Specifies intentionally untracked files that Git should ignore
├── .prettierrc           # Configuration file for Prettier code formatter
├── .github/              # GitHub configuration files
│   └── workflows/        # GitHub Actions workflow definitions
├── README.md             # This file: Project overview, setup, structure, and guidelines
├── docs/                 # All project documentation, planning, and design artifacts
│   ├── bugs/             # Bug reports and tracking
│   ├── ci-cd-pipeline/   # CI/CD pipeline documentation
│   ├── design/           # Design documents and specifications
│   ├── high-level/       # High-level architecture and project structure
│   ├── house-cleaning/   # House cleaning plans and documentation
│   ├── logs/             # Project progress logs
│   ├── testing/          # Testing documentation and guides
│   ├── ui-style/         # UI style guides and design system
│   └── wire-frame/       # Wireframes and mockups
├── eslint.config.js      # Configuration for ESLint
├── index.html            # The main HTML page that serves as the entry point for the SPA
├── node_modules/         # Directory where project dependencies are installed (managed by npm)
├── package-lock.json     # Records the exact versions of dependencies
├── package.json          # Lists project dependencies and defines scripts (dev, build, lint, etc.)
├── playwright.config.ts  # Configuration for Playwright testing
├── scripts/              # Utility scripts for development and deployment
├── src/                  # Main application source code
│   ├── App.css           # Styles for the main App component and global layout utilities
│   ├── App.jsx           # The root React component of the application
│   ├── main.jsx          # The entry point for the React application (renders App into the DOM)
│   ├── index.css         # Global styles, CSS resets, and CSS custom properties (variables)
│   ├── assets/           # UI assets processed by Vite (images, icons, fonts)
│   │   ├── icons/        # SVG icons and other icon formats
│   │   └── images/       # Image files (jpg, png, webp, etc.)
│   ├── components/       # Reusable React UI components
│   │   ├── common/       # Shared components used across multiple features
│   │   │   └── Button/   # Button component and styles
│   │   ├── features/     # Feature-specific components
│   │   │   ├── About/    # About page components
│   │   │   ├── ChatAssistant/ # Chat assistant feature components
│   │   │   ├── Menu/     # Menu-related components
│   │   │   ├── Reservation/ # Reservation-related components
│   │   │   └── Testimonials/ # Testimonial components
│   │   └── layout/       # Layout components
│   │       ├── Footer/   # Footer component and styles
│   │       ├── Header/   # Header component and styles
│   │       ├── Hero/     # Hero section component and styles
│   │       ├── MainComponent/ # Main content wrapper component
│   │       └── Nav/      # Navigation component and styles
│   ├── context/          # React Context API files (global state management)
│   ├── data/             # Static data and mock data for development
│   ├── hooks/            # Custom React Hooks
│   ├── pages/            # Top-level components representing application pages/views
│   │   ├── AboutPage/    # About page
│   │   ├── CartPage/     # Shopping cart page
│   │   ├── MenuPage/     # Menu page
│   │   ├── MyReservationsPage/ # User reservations page
│   │   └── ReservationPage/ # Reservation booking page
│   ├── services/         # API call logic and other external service integrations
│   └── utils/            # General utility functions
├── tests/                # Test files for the application
├── tests-examples/       # Example test files
└── vite.config.js        # Configuration file for Vite build tool
```

### Directory Guidelines: What Goes Where

*   **`public/`**:
    *   Place assets here that **must not** be processed by the build pipeline (e.g., `favicon.ico`, `robots.txt`, `manifest.json`).
    *   Files are served from the root path (`/`).

*   **`src/`**: This is where all your application's source code lives.
    *   **`src/assets/`**: Store images, icons, custom fonts, etc., that are directly imported and used within your React components. Vite will process these assets (optimize, hash filenames).
    *   **`src/components/`**:
        *   This directory contains all UI components organized into three main categories:
            * **`common/`**: Shared components that are used across multiple features (e.g., `Button`, form elements)
            * **`features/`**: Feature-specific components organized by feature area (e.g., `Menu`, `Reservation`)
            * **`layout/`**: Components that define the application's layout structure (e.g., `Header`, `Footer`, `Nav`)
        *   Each component should reside in its own folder containing its JSX file and scoped styles (e.g., `Button.jsx` and `Button.module.css`)
        *   Aim for small, focused components with clear responsibilities
    *   **`src/contexts/`**:
        *   Use this for React Context API providers and consumers if you need to share state across different parts of your application without prop drilling (e.g., theme context, user authentication context).
    *   **`src/hooks/`**:
        *   Place custom React Hooks here (functions starting with `use` that encapsulate reusable stateful logic or side effects).
    *   **`src/pages/`**:
        *   When you introduce routing (e.g., with React Router), create components here that represent entire pages or views of your application (e.g., `HomePage.jsx`, `ReservationsPage.jsx`).
        *   These components typically compose multiple smaller components from `src/components/`.
    *   **`src/services/`**:
        *   Use this directory for modules that handle external API calls (e.g., fetching reservation data, submitting forms to a backend).
        *   Keeps API logic separate from UI components.
    *   **`src/utils/`**:
        *   For miscellaneous helper functions that can be used across the application (e.g., date formatting, validation functions, constants).
    *   **`App.jsx`**: The main application shell. It typically sets up routing (if any) and renders the primary layout structure (Header, Main content area, Footer).
    *   **`main.jsx`**: The JavaScript entry point. Initializes React and renders the `App` component into the `index.html`.
    *   **`index.css`**: For global styles like CSS resets (e.g., `normalize.css` or custom resets), base element styling (`body`, `html`), and global CSS custom properties (variables).
    *   **`App.css`**: For styles specifically related to the `App.jsx` component's layout or very general utility classes that don't fit into `index.css` or component-specific modules.

*   **`docs/`** (Project Root):
    *   All non-code artifacts related to project planning, design, architecture, and documentation. This includes wireframes, UI mockups, project specifications, meeting notes, and this structure guide.

By following these guidelines, your project will remain organized, easy to navigate, and easier to scale as new features are added.

## Development Approach
This project follows a modern development workflow:
1. **Planning**: Define requirements and create wireframes
2. **Development**: Implement features using React components
3. **Testing**: Ensure functionality and accessibility
4. **Deployment**: Build and deploy the application

## Learning Objectives
This capstone project integrates skills from all previous courses in the Meta Front-End Developer program:
- React fundamentals and advanced concepts
- Responsive design principles
- UX/UI methodologies
- Semantic HTML structure
- CSS styling and layout
- Form validation
- Unit testing
- Accessibility compliance

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.