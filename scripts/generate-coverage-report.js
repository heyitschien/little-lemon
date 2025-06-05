#!/usr/bin/env node

/**
 * Generate Complete Coverage Report
 * 
 * This script runs a complete test coverage report for the entire project.
 * It ensures the coverage directory is cleaned before generating a new report.
 * 
 * Author: Chien Escalera Duong
 * Date: 2025-06-04
 * Version: 1.0
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

console.log(`${colors.bright}${colors.blue}=== Little Lemon Coverage Report Generator ===${colors.reset}`);
console.log(`${colors.cyan}Date: ${new Date().toLocaleString()}${colors.reset}\n`);

// Ensure we're in the project root
const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

// Clean the coverage directory (except for .gitkeep)
console.log(`${colors.yellow}Cleaning previous coverage reports...${colors.reset}`);
const coverageDir = path.join(projectRoot, 'coverage');

if (fs.existsSync(coverageDir)) {
  const files = fs.readdirSync(coverageDir);
  files.forEach(file => {
    if (file !== '.gitkeep') {
      const filePath = path.join(coverageDir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }
    }
  });
}

// Run the tests with coverage
console.log(`${colors.yellow}Running tests and generating master coverage report...${colors.reset}`);
try {
  // The MASTER_COVERAGE env var is already set in package.json
  execSync('cross-env MASTER_COVERAGE=true VITEST_COVERAGE=true vitest run', { stdio: 'inherit' });
  console.log(`\n${colors.green}Master coverage report generated successfully!${colors.reset}`);
  console.log(`${colors.bright}Report is available at: ${colors.cyan}${path.join(coverageDir, 'index.html')}${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Error generating coverage report:${colors.reset}`, error.message);
  process.exit(1);
}
