---
Title: Little Lemon Project Setup Guide
Author: Chien Escalera Duong
Date Created: 2025-06-10
Time Created: 17:05:30 PDT
Last Updated: 2025-06-10 17:05:30 PDT
Version: 1.0
---

# Little Lemon Project Setup Guide

## Welcome to the Little Lemon Capstone Project!

This guide will help you set up and run the project, whether you're familiar with modern React tooling or coming from a Create React App background.

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/heyitschien/little-lemon.git
cd little-lemon
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
You can use either of these commands:

```bash
# If you're familiar with Create React App:
npm start

# If you're familiar with Vite:
npm run dev
```

Both commands will start the development server at [http://localhost:5173](http://localhost:5173)

## About This Project

This project was built with Vite instead of Create React App to take advantage of:
- Faster development server startup
- Quicker hot module replacement
- Better performance
- Support for the latest React features

However, for convenience, we've made sure that `npm start` works just like in Create React App projects.

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run coverage:report
```

After running the coverage report, you can view the HTML report by opening `coverage/index.html` in your browser.

## Troubleshooting

If you encounter any issues:

1. Make sure you have Node.js v18 or higher installed
2. Try deleting the `node_modules` folder and running `npm install` again
3. If the development server doesn't start, check if port 5173 is already in use

## Questions?

If you have any questions about the setup process, please feel free to reach out or open an issue on the GitHub repository.

Happy reviewing!
