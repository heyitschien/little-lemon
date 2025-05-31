import { test, expect } from '@playwright/test';

test.describe('Comprehensive Homepage Tests', () => {
  test('should display all key homepage elements correctly', async ({ page }) => {
    // Navigate to the homepage (baseURL is set in playwright.config.ts)
    await page.goto('/');

    // 1. Page Title
    await expect(page).toHaveTitle('Little Lemon - Chicago | Family-Owned Mediterranean Restaurant');

    // 2. Hero Section
    await expect(page.getByRole('heading', { name: 'Little Lemon', level: 1 })).toBeVisible();
    await expect(page.locator('h3:has-text("Chicago")')).toBeVisible(); // Tagline
    await expect(page.getByRole('button', { name: 'Reserve a Table' })).toBeVisible();
    // Check for a hero image. This locator assumes it's an img tag within the first section (often the hero)
    // or specifically within a section containing the H1 'Little Lemon'.
    // A more robust selector (e.g., alt text or data-testid) is recommended if available.
    await expect(page.locator('section:has(h1:text-is("Little Lemon")) img').first()).toBeVisible();

    // 3. Navigation (Header)
    // Assuming nav is within a <nav> element or has a role='navigation'
    const nav = page.getByRole('navigation').first(); // Use .first() if multiple navs exist (e.g. header and footer)
    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Menu' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Reservations' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Order Online' })).toBeVisible();
    // await expect(nav.getByRole('link', { name: 'Login' })).toBeVisible(); // If applicable

    // 4. Specials/Highlights Section
    // Using a case-insensitive regular expression for the heading name for flexibility.
    await expect(page.getByRole('heading', { name: /This weeks specials!/i })).toBeVisible();
    // Check for at least one "card" or "article" representing a special item.
    // This locator is generic; you'd ideally use more specific selectors like data-testid or class names.
    const specialsSection = page.locator('section:has-text("This weeks specials!")');
    await expect(specialsSection.locator('article').first()).toBeVisible();
    // Example: Check for a specific special item and its "Order a delivery" button
    // This assumes the item text (e.g., "Greek salad") is present within an article.
    const greekSaladCard = specialsSection.locator('article:has-text("Greek salad")');
    await expect(greekSaladCard).toBeVisible();
    await expect(greekSaladCard.getByRole('button', { name: 'Order a delivery' })).toBeVisible();

    // 5. Testimonials Section
    await expect(page.getByRole('heading', { name: /Testimonials/i })).toBeVisible();
    // Check for at least one testimonial item (e.g., an article within the testimonials section).
    const testimonialsSection = page.locator('section:has-text("Testimonials")');
    await expect(testimonialsSection.locator('article').first()).toBeVisible();

    // 6. About Section (Summary on Homepage)
    // Assuming a heading like "Little Lemon" or "About Little Lemon" for this section.
    // Using a more specific locator if the heading is just "Little Lemon" to differentiate from hero.
    const aboutSection = page.locator('section:has-text("Mario and Adrian")'); // Assuming this text is unique to about section
    await expect(aboutSection.getByRole('heading', { name: /Little Lemon/i, level: 2})).toBeVisible(); // Or appropriate level
    await expect(aboutSection.locator('p').first()).toBeVisible(); // Check for some paragraph text
    await expect(aboutSection.locator('img').first()).toBeVisible(); // Check for an image in the about section

    // 7. Footer
    const footer = page.getByRole('contentinfo'); // Standard role for <footer>
    await expect(footer).toBeVisible();
    // Check for some common footer links or copyright text
    // Ensure these links are within the footer to avoid matching header links
    await expect(footer.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(footer.getByText(/©.*Little Lemon/i)).toBeVisible(); // Copyright text (case-insensitive)
  });
});
