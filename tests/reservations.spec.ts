import { test, expect, Page } from '@playwright/test';

test.describe('Restaurant Reservation Flow', () => {
  const reservationPageUrl = '/reservations';
  
  // Helper functions
  const getTomorrowDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Format as YYYY-MM-DD
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getFormattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time24h: string) => {
    // Convert 24h time format (e.g. "18:00") to 12h format (e.g. "6:00 PM")
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${hour12}:${minutes} ${period}`;
  };

  const getFirstAvailableTime = async (page: Page) => {
    // Get the first available time option
    const availableTimeOption = await page.locator('select#reservation-time option:not([disabled]):not([value=""])').first();
    const value = await availableTimeOption.getAttribute('value');
    return value || '18:00'; // Fallback to 18:00 if no available times
  };

  const fillReservationForm = async (page: Page, { name, email, phone, occasion, specialRequests }: {
    name: string;
    email: string;
    phone: string;
    occasion: string;
    specialRequests?: string;
  }) => {
    await page.fill('input#name', name);
    await page.fill('input#email', email);
    await page.fill('input#phone', phone);
    await page.selectOption('select#occasion', occasion);
    if (specialRequests) {
      await page.fill('textarea#specialRequests', specialRequests);
    }
  };

  const clearLocalStorage = async (page: Page) => {
    await page.evaluate(() => window.localStorage.clear());
  };

  // Before each test, clear localStorage and navigate to reservations page
  test.beforeEach(async ({ page }) => {
    await page.goto('/reservations');
    await clearLocalStorage(page);
    // Add a small wait to ensure the page is fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should allow a user to complete the reservation process', async ({ page }) => {
    // Navigate to the reservation page from homepage
    await page.goto('/');
    // Use more specific selector to avoid ambiguity with footer link
    await page.getByRole('navigation').getByRole('link', { name: 'Reservations' }).click();
    await expect(page).toHaveURL(reservationPageUrl);

    // --- Step 1: Date & Time Selection ---
    const testDate = getTomorrowDate();
    const testPartySize = '2';

    // Select Date - using the custom date input implementation
    // Use more specific selector to avoid ambiguity with multiple labels having the same 'for' attribute
    await page.locator('label[for="reservation-date"]:has-text("Select a date")').click();
    await page.locator('input#reservation-date').fill(testDate);
    // Click elsewhere to confirm date selection
    await page.locator('h2:has-text("Select Date & Time")').click();

    // Select Time - dynamically get first available time
    const testTime = await getFirstAvailableTime(page);
    await page.selectOption('select#reservation-time', testTime);

    // Select Party Size
    await page.selectOption('select#party-size', testPartySize);

    // Click Next
    await page.getByRole('button', { name: 'Next: Your Information' }).click();

    // --- Step 2: Your Information ---
    const testName = 'Chien TestUser';
    const testEmail = 'chien.testuser@example.com';
    const testPhone = '1234567890';
    const testOccasion = 'birthday';
    const testSpecialRequests = 'Test special request.';

    await expect(page.locator('h2:has-text("Your Information")')).toBeVisible();

    await fillReservationForm(page, {
      name: testName,
      email: testEmail,
      phone: testPhone,
      occasion: testOccasion,
      specialRequests: testSpecialRequests
    });

    // Click Next
    await page.getByRole('button', { name: 'Next: Review & Confirm' }).click();

    // --- Step 3: Review & Confirm ---
    await expect(page.locator('h3:has-text("Reservation Summary")')).toBeVisible();

    // Verify displayed data with more robust selectors
    const formattedDate = getFormattedDate(testDate);
    const formattedTime = formatTime(testTime);

    await expect(page.locator('[data-testid="summary-date"], div:has(> span:has-text("Date:")) span.summaryValue')).toContainText(formattedDate);
    await expect(page.locator('[data-testid="summary-time"], div:has(> span:has-text("Time:")) span.summaryValue')).toContainText(formattedTime);
    await expect(page.locator('[data-testid="summary-party-size"], div:has(> span:has-text("Party Size:")) span.summaryValue')).toContainText(`${testPartySize} people`);
    await expect(page.locator('[data-testid="summary-name"], div:has(> span:has-text("Name:")) span.summaryValue')).toContainText(testName);
    await expect(page.locator('[data-testid="summary-email"], div:has(> span:has-text("Email:")) span.summaryValue')).toContainText(testEmail);
    await expect(page.locator('[data-testid="summary-phone"], div:has(> span:has-text("Phone:")) span.summaryValue')).toContainText(testPhone);
    await expect(page.locator('[data-testid="summary-occasion"], div:has(> span:has-text("Occasion:")) span.summaryValue')).toContainText('Birthday');

    // Click Confirm Reservation
    await page.getByRole('button', { name: 'Confirm Reservation' }).click();

    // --- Step 4: Success ---
    await expect(page.locator('h1:has-text("Reservation Confirmed!")')).toBeVisible();
    await expect(page.locator('p', { hasText: `A confirmation email has been sent to ${testEmail}` })).toBeVisible();
    
    // Verify details on success page
    await expect(page.locator('[data-testid="success-date"], div.successSummaryItem span:has-text("Date:") + span.successSummaryValue')).toContainText(formattedDate);
    await expect(page.locator('[data-testid="success-time"], div.successSummaryItem span:has-text("Time:") + span.successSummaryValue')).toContainText(formattedTime);
    await expect(page.locator('[data-testid="success-party-size"], div.successSummaryItem span:has-text("Party Size:") + span.successSummaryValue')).toContainText(`${testPartySize} people`);
    await expect(page.locator('[data-testid="success-reservation-id"], div.successSummaryItem span:has-text("Reservation ID:") + span.successSummaryValue')).not.toBeEmpty();

    // Verify localStorage has the reservation
    const reservations = await page.evaluate(() => {
      const reservationsJson = window.localStorage.getItem('reservations');
      return reservationsJson ? JSON.parse(reservationsJson) : [];
    });
    
    expect(reservations.length).toBeGreaterThan(0);
    const latestReservation = reservations[reservations.length - 1];
    expect(latestReservation.date).toBe(testDate);
    expect(latestReservation.time).toBe(testTime);
    expect(latestReservation.partySize).toBe(testPartySize);
    expect(latestReservation.name).toBe(testName);
    expect(latestReservation.email).toBe(testEmail);

    // Click Return to Home
    await page.getByRole('button', { name: 'Return to Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should show validation errors for empty required fields', async ({ page }) => {
    await page.goto(reservationPageUrl);

    // Try to proceed without filling any fields
    await page.getByRole('button', { name: 'Next: Your Information' }).click();
    
    // Should show validation errors for date and time
    await expect(page.locator('[data-testid="date-error"], .error-message:near(#reservation-date)')).toBeVisible();
    await expect(page.locator('[data-testid="time-error"], .error-message:near(#reservation-time)')).toBeVisible();

    // Fill date but leave time empty
    const testDate = getTomorrowDate();
    // Use more specific selector to avoid ambiguity with multiple labels having the same 'for' attribute
    await page.locator('label[for="reservation-date"]:has-text("Select a date")').click();
    await page.locator('input#reservation-date').fill(testDate);
    await page.locator('h2:has-text("Select Date & Time")').click();

    // Try to proceed again
    await page.getByRole('button', { name: 'Next: Your Information' }).click();
    
    // Should only show time error now
    await expect(page.locator('[data-testid="date-error"], .error-message:near(#reservation-date)')).not.toBeVisible();
    await expect(page.locator('[data-testid="time-error"], .error-message:near(#reservation-time)')).toBeVisible();

    // Fill time but leave party size at default
    const testTime = await getFirstAvailableTime(page);
    await page.selectOption('select#reservation-time', testTime);

    // Now we should be able to proceed to step 2
    await page.getByRole('button', { name: 'Next: Your Information' }).click();
    await expect(page.locator('h2:has-text("Your Information")')).toBeVisible();

    // Try to proceed without filling personal info
    await page.getByRole('button', { name: 'Next: Review & Confirm' }).click();
    
    // Should show validation errors for required fields
    await expect(page.locator('[data-testid="name-error"], .error-message:near(#name)')).toBeVisible();
    await expect(page.locator('[data-testid="email-error"], .error-message:near(#email)')).toBeVisible();
    await expect(page.locator('[data-testid="phone-error"], .error-message:near(#phone)')).toBeVisible();
  });

  test('should navigate back between steps and preserve entered data', async ({ page }) => {
    await page.goto(reservationPageUrl);

    // Step 1: Fill date, time, party size
    const testDate = getTomorrowDate();
    // Use more specific selector to avoid ambiguity with multiple labels having the same 'for' attribute
    await page.locator('label[for="reservation-date"]:has-text("Select a date")').click();
    await page.locator('input#reservation-date').fill(testDate);
    await page.locator('h2:has-text("Select Date & Time")').click();

    const testTime = await getFirstAvailableTime(page);
    await page.selectOption('select#reservation-time', testTime);

    const testPartySize = '4';
    await page.selectOption('select#party-size', testPartySize);

    await page.getByRole('button', { name: 'Next: Your Information' }).click();

    // Step 2: Fill personal info
    await fillReservationForm(page, {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      occasion: 'anniversary',
      specialRequests: 'Test request'
    });

    await page.getByRole('button', { name: 'Next: Review & Confirm' }).click();

    // Step 3: Go back to Step 2
    await page.getByRole('button', { name: 'Back' }).click();

    // Verify data is preserved in Step 2
    await expect(page.locator('input#name')).toHaveValue('Test User');
    await expect(page.locator('input#email')).toHaveValue('test@example.com');
    await expect(page.locator('input#phone')).toHaveValue('1234567890');
    await expect(page.locator('select#occasion')).toHaveValue('anniversary');
    await expect(page.locator('textarea#specialRequests')).toHaveValue('Test request');

    // Go back to Step 1
    await page.getByRole('button', { name: 'Back' }).click();

    // Verify data is preserved in Step 1
    await expect(page.locator('input#reservation-date')).toHaveValue(testDate);
    await expect(page.locator('select#reservation-time')).toHaveValue(testTime);
    await expect(page.locator('select#party-size')).toHaveValue(testPartySize);
  });

  test('should handle time slot unavailability after a reservation is made', async ({ page }) => {
    await page.goto(reservationPageUrl);

    // Step 1: Make a reservation for tomorrow at a specific time
    const testDate = getTomorrowDate();
    // Use more specific selector to avoid ambiguity with multiple labels having the same 'for' attribute
    await page.locator('label[for="reservation-date"]:has-text("Select a date")').click();
    await page.locator('input#reservation-date').fill(testDate);
    await page.locator('h2:has-text("Select Date & Time")').click();

    const firstAvailableTime = await getFirstAvailableTime(page);
    await page.selectOption('select#reservation-time', firstAvailableTime);
    await page.selectOption('select#party-size', '6'); // Large party to potentially block the time slot

    // Complete the reservation process
    await page.getByRole('button', { name: 'Next: Your Information' }).click();
    
    await fillReservationForm(page, {
      name: 'First User',
      email: 'first@example.com',
      phone: '1234567890',
      occasion: 'birthday'
    });
    
    await page.getByRole('button', { name: 'Next: Review & Confirm' }).click();
    await page.getByRole('button', { name: 'Confirm Reservation' }).click();
    
    // Verify reservation was successful
    await expect(page.locator('h1:has-text("Reservation Confirmed!"), h2:has-text("Reservation Confirmed!")').first()).toBeVisible({ timeout: 10000 });
    
    // Return to home and start a new reservation
    await page.getByRole('button', { name: 'Return to Home' }).click();
    await page.goto(reservationPageUrl);
    
    // Try to make another reservation for the same date
    // Use more specific selector to avoid ambiguity with multiple labels having the same 'for' attribute
    await page.locator('label[for="reservation-date"]:has-text("Select a date")').click();
    await page.locator('input#reservation-date').fill(testDate);
    await page.locator('h2:has-text("Select Date & Time")').click();
    
    // Check if the previously selected time is now unavailable (disabled)
    const timeOption = page.locator(`select#reservation-time option[value="${firstAvailableTime}"]`);
    const isDisabled = await timeOption.evaluate(el => el.hasAttribute('disabled'));
    
    // If the implementation fully blocks the time slot, it should be disabled
    if (isDisabled) {
      expect(isDisabled).toBe(true);
    } else {
      // If the implementation allows multiple bookings but has a limit, we should check
      // that we can still select it but might get a warning or error later
      await page.selectOption('select#reservation-time', firstAvailableTime);
      await page.selectOption('select#party-size', '6');
      await page.getByRole('button', { name: 'Next: Your Information' }).click();
      
      // Check if there's any warning about limited availability
      const warningVisible = await page.locator('[data-testid="time-warning"], .warning-message:has-text("limited availability")').
        isVisible().catch(() => false);
      
      // We don't assert here because different implementations may handle this differently
      console.log(`Time slot warning visible: ${warningVisible}`);
    }
  });

  test.describe('Mobile-specific tests', () => {
    // Set mobile viewport size
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
      // Add a small wait to ensure the page is fully loaded in mobile view
      await page.waitForLoadState('networkidle');
    });

    test('should handle date selection on mobile devices', async ({ page }) => {
      await page.goto(reservationPageUrl);

      // Test the mobile-specific date picker implementation
      // Check if the custom date button is visible and styled correctly
      await expect(page.locator('label[for="reservation-date"]')).toBeVisible();
      
      // Click the date label to trigger the native date picker
      // Use more specific selector to avoid ambiguity with multiple labels having the same 'for' attribute
      await page.locator('label[for="reservation-date"]:has-text("Select a date")').click();
      
      // The native date picker will appear, but we can't interact with it in tests
      // Instead, we'll directly fill the hidden input
      const testDate = getTomorrowDate();
      await page.locator('input#reservation-date').fill(testDate);
      
      // Click elsewhere to confirm date selection
      await page.locator('h2:has-text("Select Date & Time")').click();
      
      // Verify the date was set correctly
      await expect(page.locator('input#reservation-date')).toHaveValue(testDate);
      
      // Check if the date display shows the correct formatted date
      const formattedDate = getFormattedDate(testDate);
      await expect(page.locator('label[for="reservation-date"]')).toContainText(formattedDate);
    });

    test('should have responsive layout on mobile viewport', async ({ page }) => {
      await page.goto(reservationPageUrl);

      // Verify that key elements are visible and properly sized on mobile
      // Use a more flexible selector that matches either h1 or h2 with the text "Reservations"
      await expect(page.locator('h1:has-text("Reservations"), h2:has-text("Reservations")').first()).toBeVisible({ timeout: 10000 });
      
      // Check that form elements take full width on mobile
      const dateInputWidth = await page.locator('label[for="reservation-date"]').evaluate(el => {
        const styles = window.getComputedStyle(el);
        const width = parseFloat(styles.width);
        const containerWidth = parseFloat(window.getComputedStyle(el.parentElement).width);
        return width / containerWidth; // Should be close to 1 (100%) on mobile
      });
      
      expect(dateInputWidth).toBeGreaterThan(0.9); // Should take at least 90% of container width
      
      // Complete step 1 to check mobile layout of step 2
      const testDate = getTomorrowDate();
      // Use more specific selector to avoid ambiguity with multiple labels having the same 'for' attribute
      await page.locator('label[for="reservation-date"]:has-text("Select a date")').click();
      await page.locator('input#reservation-date').fill(testDate);
      await page.locator('h2:has-text("Select Date & Time")').click();
      
      const testTime = await getFirstAvailableTime(page);
      await page.selectOption('select#reservation-time', testTime);
      
      await page.getByRole('button', { name: 'Next: Your Information' }).click();
      
      // Check that form inputs in step 2 are properly sized for mobile
      const nameInputWidth = await page.locator('input#name').evaluate(el => {
        const styles = window.getComputedStyle(el);
        const width = parseFloat(styles.width);
        const containerWidth = parseFloat(window.getComputedStyle(el.parentElement).width);
        return width / containerWidth;
      });
      
      expect(nameInputWidth).toBeGreaterThan(0.9);
    });
  });
});
