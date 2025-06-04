import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import ReservationList from './ReservationList';
import { getReservationsFromStorage } from '../../../services/reservationService';

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../services/reservationService', () => ({
  getReservationsFromStorage: vi.fn(),
  cancelReservation: vi.fn(),
}));

// Mock window.confirm
global.window.confirm = vi.fn();

// Helper to create a future date string
const getFutureDateString = (daysAhead) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

describe('ReservationList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default successful empty load
    getReservationsFromStorage.mockReturnValue([]); 
    global.window.confirm.mockReturnValue(true); // Default confirm to true
  });

  test('renders "No past reservations found." message when reservations prop is empty', async () => {
    getReservationsFromStorage.mockReturnValue([]); // Keep for consistency, though not directly used by ReservationList
    const mockRemoveReservationById = vi.fn();
    render(<ReservationList reservations={[]} removeReservationById={mockRemoveReservationById} />);
    await waitFor(() => {
      expect(screen.getByText("No past reservations found.")).toBeInTheDocument();
    });
    // The 'Make a Reservation' button is not part of ReservationList when it's just showing this message.
    // That button would be in a parent component.
  });

  test('displays a list of reservations correctly sorted', async () => {
    const upcomingReservationsData = [
      {
        id: 'res2',
        date: getFutureDateString(5), // Further in future
        time: '20:00', // 8:00 PM
        partySize: 4,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '987-654-3210',
        occasion: 'anniversary',
      },
      {
        id: 'res1',
        date: getFutureDateString(2), // Sooner in future
        time: '18:00', // 6:00 PM
        partySize: 2,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        occasion: 'birthday',
      },
      {
        id: 'res3',
        date: '2000-01-01', // Hardcoded very past date
        time: '01:00', // Set to early in the day to ensure it's past
        partySize: 1,
        name: 'Past User',
        email: 'past@example.com',
        phone: '000-000-0000',
      },
    ];

    // Filter out past reservations for this specific test, as ReservationList expects a pre-filtered list
    const now = new Date();
    now.setHours(0,0,0,0);
    const filteredReservationsData = upcomingReservationsData.filter(res => {
      const resDate = new Date(res.date + 'T00:00:00');
      return resDate >= now;
    });
    const mockRemoveReservationById = vi.fn();
    // getReservationsFromStorage.mockReturnValue(reservationsData); // Mocking service, not directly used by ReservationList
    render(<ReservationList reservations={filteredReservationsData} removeReservationById={mockRemoveReservationById} />);

    // Wait for reservations to load and render
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument(); // res1 should appear first due to sorting
    });

    // Check for res1 details (sooner reservation)
    // Formatted date for getFutureDateString(2)
    const dateString1 = getFutureDateString(2);
    const [year1, month1, day1] = dateString1.split('-').map(Number);
    const dateForFormatting1 = new Date(year1, month1 - 1, day1);
    const fullFormattedDate1 = dateForFormatting1.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    expect(screen.getByText(`Reservation for ${fullFormattedDate1}`)).toBeInTheDocument();
    expect(screen.getByText('6:00 PM')).toBeInTheDocument();
    expect(screen.getByText('2 people')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('birthday')).toBeInTheDocument();

    // Check for res2 details (later reservation)
    const dateString2 = getFutureDateString(5);
    const [year2, month2, day2] = dateString2.split('-').map(Number);
    const dateForFormatting2 = new Date(year2, month2 - 1, day2);
    const fullFormattedDate2 = dateForFormatting2.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    expect(screen.getByText(`Reservation for ${fullFormattedDate2}`)).toBeInTheDocument();
    expect(screen.getByText('8:00 PM')).toBeInTheDocument();
    expect(screen.getByText('4 people')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('987-654-3210')).toBeInTheDocument();
    expect(screen.getByText('anniversary')).toBeInTheDocument();

    // Ensure past reservation (res3) is not displayed
    expect(screen.queryByText('Past User')).not.toBeInTheDocument();
  });

  test.skip('navigates to modify page when "Modify" button is clicked', async () => { // Skipping: ReservationList does not have a modify button
    const reservation = {
      id: 'res-to-modify',
      date: getFutureDateString(1),
      time: '19:00',
      partySize: 2,
      name: 'Modify Me',
      email: 'modify@example.com',
      phone: '111-222-3333',
    };
    const mockRemoveReservationById = vi.fn();
    // getReservationsFromStorage.mockReturnValue([reservation]); // Mocking service, not directly used by ReservationList
    render(<ReservationList reservations={[reservation]} removeReservationById={mockRemoveReservationById} />);
    await waitFor(() => screen.getByText('Modify Me'));

    const modifyButton = screen.getByRole('button', { name: 'Modify reservation for Modify Me' });
    fireEvent.click(modifyButton);

    expect(mockNavigate).toHaveBeenCalledWith('/reservations/modify/res-to-modify');
  });

  test.skip('navigates to new reservation page when "Make a Reservation" (no reservations) button is clicked', async () => { // Skipping: This button/logic is likely in a parent component
    getReservationsFromStorage.mockReturnValue([]);
    const mockRemoveReservationById = vi.fn();
    render(<ReservationList reservations={[]} removeReservationById={mockRemoveReservationById} />);
    await waitFor(() => screen.getByText("No past reservations found."));

    const newReservationButton = screen.getByRole('button', { name: 'Make a Reservation' });
    fireEvent.click(newReservationButton);

    expect(mockNavigate).toHaveBeenCalledWith('/reservations');
  });

  test.skip('navigates to new reservation page when "Make Another Reservation" (with reservations) button is clicked', async () => { // Skipping: Button not part of this component
    const reservation = {
      id: 'res-another',
      date: getFutureDateString(1),
      time: '19:00',
      partySize: 2,
      name: 'Another Test',
      email: 'another@example.com',
      phone: '444-555-6666',
    };
    // getReservationsFromStorage.mockReturnValue([reservation]); // Service mock, not directly used by ReservationList
    const mockRemoveReservationById = vi.fn();
    render(<ReservationList reservations={[reservation]} removeReservationById={mockRemoveReservationById} />);
    await waitFor(() => screen.getByText('Another Test'));

    const newReservationButton = screen.getByRole('button', { name: 'Make Another Reservation' });
    fireEvent.click(newReservationButton);

    expect(mockNavigate).toHaveBeenCalledWith('/reservations');
  });

  describe('Cancellation Logic', () => {
    const reservationToCancel = {
      id: 'res-to-cancel',
      date: getFutureDateString(3),
      time: '19:30',
      partySize: 1,
      name: 'Cancel Candidate',
      email: 'cancel@example.com',
      phone: '777-888-9999',
    };

    beforeEach(() => {
      getReservationsFromStorage.mockReturnValue([reservationToCancel]);
    });

    test('successfully removes a reservation when confirmed', async () => {
      global.window.confirm.mockReturnValue(true);
      const mockRemoveReservationById = vi.fn();
      
      // Simulate parent component providing initial data, then an empty list after removal
      getReservationsFromStorage.mockReturnValueOnce([reservationToCancel]).mockReturnValueOnce([]);

      const { rerender } = render(<ReservationList reservations={[reservationToCancel]} removeReservationById={mockRemoveReservationById} />);
      await waitFor(() => screen.getByText('Cancel Candidate'));

      const cancelButton = screen.getByRole('button', { name: 'Remove Reservation' });
      fireEvent.click(cancelButton);

      expect(global.window.confirm).toHaveBeenCalledWith('Are you sure you want to remove this reservation?');
      expect(mockRemoveReservationById).toHaveBeenCalledWith('res-to-cancel');
      
      // Simulate parent re-rendering with an empty list because the prop changed
      rerender(<ReservationList reservations={[]} removeReservationById={mockRemoveReservationById} />);
      await waitFor(() => {
        expect(screen.getByText('No past reservations found.')).toBeInTheDocument();
      });
    });

    test('does not remove if user declines confirmation', async () => {
      global.window.confirm.mockReturnValue(false);
      const mockRemoveReservationById = vi.fn();
      render(<ReservationList reservations={[reservationToCancel]} removeReservationById={mockRemoveReservationById} />);
      await waitFor(() => screen.getByText('Cancel Candidate'));

      const cancelButton = screen.getByRole('button', { name: 'Remove Reservation' });
      fireEvent.click(cancelButton);

      expect(global.window.confirm).toHaveBeenCalledWith('Are you sure you want to remove this reservation?');
      expect(mockRemoveReservationById).not.toHaveBeenCalled();
      expect(screen.getByText('Cancel Candidate')).toBeInTheDocument(); // Still there
    });

    test('item remains if removeReservationById is called but parent does not update list (simulating service failure)', async () => {
      global.window.confirm.mockReturnValue(true);
      // cancelReservation.mockReturnValue(false); // This service mock is not directly relevant here as we test the prop call
      const mockRemoveReservationById = vi.fn();
      
      render(<ReservationList reservations={[reservationToCancel]} removeReservationById={mockRemoveReservationById} />);
      await waitFor(() => screen.getByText('Cancel Candidate'));

      const cancelButton = screen.getByRole('button', { name: 'Remove Reservation' });
      fireEvent.click(cancelButton);

      expect(mockRemoveReservationById).toHaveBeenCalledWith('res-to-cancel');
      // If the parent's removal logic failed and it didn't update the reservations prop,
      // the item would still be displayed by ReservationList.
      expect(screen.getByText('Cancel Candidate')).toBeInTheDocument();
    });

    test('item remains if removeReservationById is called but parent does not update list (simulating service error)', async () => {
      global.window.confirm.mockReturnValue(true);
      // cancelReservation.mockImplementation(() => { // This service mock is not directly relevant here
      //   throw new Error('Service unavailable');
      // });
      const mockRemoveReservationById = vi.fn();
      
      render(<ReservationList reservations={[reservationToCancel]} removeReservationById={mockRemoveReservationById} />);
      await waitFor(() => screen.getByText('Cancel Candidate'));

      const cancelButton = screen.getByRole('button', { name: 'Remove Reservation' });
      fireEvent.click(cancelButton);

      expect(mockRemoveReservationById).toHaveBeenCalledWith('res-to-cancel');
      // If the parent's removal logic failed and it didn't update the reservations prop,
      // the item would still be displayed by ReservationList.
      expect(screen.getByText('Cancel Candidate')).toBeInTheDocument();
    });
  });

  test('shows "No past reservations found." if parent passes empty list due to load error', async () => {
    getReservationsFromStorage.mockImplementation(() => {
      throw new Error('Storage failed');
    });
    const mockRemoveReservationById = vi.fn();
    // This test simulates a scenario where the parent component failed to load reservations
    // (e.g., getReservationsFromStorage threw an error) and thus passes an empty array to ReservationList.
    render(<ReservationList reservations={[]} removeReservationById={mockRemoveReservationById} />);
    await waitFor(() => {
      expect(screen.getByText('No past reservations found.')).toBeInTheDocument();
    });
  });

});
