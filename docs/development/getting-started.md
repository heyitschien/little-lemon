# Getting Started

## Overview

This guide will help you set up your development environment for the Little Lemon project and get started with development.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/heyitschien/little-lemon.git
cd little-lemon
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173/` (or another port if 5173 is in use).

## Project Structure

The Little Lemon project follows a structured organization:

```
little-lemon/
├── src/                  # Main application source code
│   ├── components/       # Reusable React UI components
│   │   ├── common/       # Shared components used across multiple features
│   │   ├── features/     # Feature-specific components
│   │   └── layout/       # Layout components
│   ├── pages/            # Top-level page components
│   ├── context/          # React Context API files
│   ├── hooks/            # Custom React Hooks
│   ├── services/         # API services
│   └── assets/           # Static assets
├── docs/                 # Project documentation
├── tests/                # Test files
└── ...                   # Configuration files
```

## Development Workflow

1. **Create a feature branch**

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**

Follow the [coding standards](./coding-standards.md) and [component guidelines](./component-guidelines.md).

3. **Test your changes**

```bash
# Run tests
npm test

# Start the development server to manually test
npm run dev
```

4. **Commit your changes**

```bash
git add .
git commit -m "feat: Add your feature description"
```

5. **Push your changes**

```bash
git push origin feature/your-feature-name
```

6. **Create a pull request**

Create a pull request from your feature branch to the `staging` branch.

## Mobile Development

Since the Little Lemon application is primarily focused on mobile, follow these guidelines:

1. **Use mobile device emulation**
   - Chrome DevTools: Toggle device toolbar (Ctrl+Shift+M or Cmd+Shift+M)
   - Test on various mobile viewport sizes (e.g., iPhone SE, iPhone 12, Pixel 5)

2. **Mobile-first development**
   - Start with mobile layouts and progressively enhance for larger screens
   - Use responsive units (rem, em, %) instead of fixed units (px)
   - Test touch interactions

3. **Performance considerations**
   - Optimize images and assets for mobile
   - Minimize JavaScript bundle size
   - Implement lazy loading where appropriate

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues
- `npm run format` - Format code using Prettier
- `npm test` - Run tests

## Getting Help

If you encounter any issues or have questions, refer to:
- [Project documentation](../index.md)
- [Component guidelines](./component-guidelines.md)
- [Coding standards](./coding-standards.md)

---

Last updated: 2025-05-30
