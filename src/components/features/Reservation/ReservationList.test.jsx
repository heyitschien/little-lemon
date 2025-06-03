import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import ReservationList from './ReservationList';
import { getReservationsFromStorage, cancelReservation } from '../../../services/reservationService';

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

  test('renders "no reservations" message when storage is empty', async () => {
    getReservationsFromStorage.mockReturnValue([]);
    render(<ReservationList />);
    await waitFor(() => {
      expect(screen.getByText("You don't have any upcoming reservations.")).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Make a Reservation' })).toBeInTheDocument();
  });

  test('displays a list of upcoming reservations correctly sorted', async () => {
    const reservationsData = [
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
        date: getFutureDateString(-1), // Past reservation, should be filtered out
        time: '01:00', // Set to early in the day to ensure it's past
        partySize: 1,
        name: 'Past User',
        email: 'past@example.com',
        phone: '000-000-0000',
      },
    ];
    getReservationsFromStorage.mockReturnValue(reservationsData);

    render(<ReservationList />);

    // Wait for reservations to load and render
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument(); // res1 should appear first due to sorting
    });

    // Check for res1 details (sooner reservation)
    // Formatted date for getFutureDateString(2)
    const dateString1 = getFutureDateString(2);
    const [year1, month1, day1] = dateString1.split('-').map(Number);
    const dateForFormatting1 = new Date(year1, month1 - 1, day1);
    const formattedDate1 = dateForFormatting1.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    
    expect(screen.getByText(formattedDate1)).toBeInTheDocument();
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
    const formattedDate2 = dateForFormatting2.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

    expect(screen.getByText(formattedDate2)).toBeInTheDocument();
    expect(screen.getByText('8:00 PM')).toBeInTheDocument();
    expect(screen.getByText('4 people')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('987-654-3210')).toBeInTheDocument();
    expect(screen.getByText('anniversary')).toBeInTheDocument();

    // Ensure past reservation (res3) is not displayed
    expect(screen.queryByText('Past User')).not.toBeInTheDocument();

    // Check for "Make Another Reservation" button
    expect(screen.getByRole('button', { name: 'Make Another Reservation' })).toBeInTheDocument();
  });

  test('navigates to modify page when "Modify" button is clicked', async () => {
    const reservation = {
      id: 'res-to-modify',
      date: getFutureDateString(1),
      time: '19:00',
      partySize: 2,
      name: 'Modify Me',
      email: 'modify@example.com',
      phone: '111-222-3333',
    };
    getReservationsFromStorage.mockReturnValue([reservation]);

    render(<ReservationList />);
    await waitFor(() => screen.getByText('Modify Me'));

    const modifyButton = screen.getByRole('button', { name: 'Modify reservation for Modify Me' });
    fireEvent.click(modifyButton);

    expect(mockNavigate).toHaveBeenCalledWith('/reservations/modify/res-to-modify');
  });

  test('navigates to new reservation page when "Make a Reservation" (no reservations) button is clicked', async () => {
    getReservationsFromStorage.mockReturnValue([]);
    render(<ReservationList />);
    await waitFor(() => screen.getByText("You don't have any upcoming reservations."));

    const newReservationButton = screen.getByRole('button', { name: 'Make a Reservation' });
    fireEvent.click(newReservationButton);

    expect(mockNavigate).toHaveBeenCalledWith('/reservations');
  });

  test('navigates to new reservation page when "Make Another Reservation" (with reservations) button is clicked', async () => {
    const reservation = {
      id: 'res-another',
      date: getFutureDateString(1),
      time: '19:00',
      partySize: 2,
      name: 'Another Test',
      email: 'another@example.com',
      phone: '444-555-6666',
    };
    getReservationsFromStorage.mockReturnValue([reservation]);
    render(<ReservationList />);
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

    test('successfully cancels a reservation when confirmed', async () => {
      global.window.confirm.mockReturnValue(true);
      cancelReservation.mockReturnValue(true);

      render(<ReservationList />);
      await waitFor(() => screen.getByText('Cancel Candidate'));

      const cancelButton = screen.getByRole('button', { name: 'Cancel reservation for Cancel Candidate' });
      fireEvent.click(cancelButton);

      expect(global.window.confirm).toHaveBeenCalledWith('Are you sure you want to cancel this reservation?');
      expect(cancelReservation).toHaveBeenCalledWith('res-to-cancel');
      
      // Check that the item is removed from the list
      await waitFor(() => {
        expect(screen.queryByText('Cancel Candidate')).not.toBeInTheDocument();
      });
      // Should show no reservations message if it was the only one
      expect(screen.getByText("You don't have any upcoming reservations.")).toBeInTheDocument();
    });

    test('does not cancel if user declines confirmation', async () => {
      global.window.confirm.mockReturnValue(false);

      render(<ReservationList />);
      await waitFor(() => screen.getByText('Cancel Candidate'));

      const cancelButton = screen.getByRole('button', { name: 'Cancel reservation for Cancel Candidate' });
      fireEvent.click(cancelButton);

      expect(global.window.confirm).toHaveBeenCalledWith('Are you sure you want to cancel this reservation?');
      expect(cancelReservation).not.toHaveBeenCalled();
      expect(screen.getByText('Cancel Candidate')).toBeInTheDocument(); // Still there
    });

    test('shows error message if cancellation service returns false', async () => {
      global.window.confirm.mockReturnValue(true);
      cancelReservation.mockReturnValue(false);

      render(<ReservationList />);
      await waitFor(() => screen.getByText('Cancel Candidate'));

      const cancelButton = screen.getByRole('button', { name: 'Cancel reservation for Cancel Candidate' });
      fireEvent.click(cancelButton);

      expect(cancelReservation).toHaveBeenCalledWith('res-to-cancel');
      await waitFor(() => {
        expect(screen.getByText('Failed to cancel reservation. Please try again.')).toBeInTheDocument();
      });
      expect(screen.queryByText('Cancel Candidate')).not.toBeInTheDocument();
    });

    test('shows error message if cancellation service throws an error', async () => {
      global.window.confirm.mockReturnValue(true);
      cancelReservation.mockImplementation(() => {
        throw new Error('Service unavailable');
      });

      render(<ReservationList />);
      await waitFor(() => screen.getByText('Cancel Candidate'));

      const cancelButton = screen.getByRole('button', { name: 'Cancel reservation for Cancel Candidate' });
      fireEvent.click(cancelButton);

      expect(cancelReservation).toHaveBeenCalledWith('res-to-cancel');
      await waitFor(() => {
        expect(screen.getByText('An error occurred while cancelling the reservation.')).toBeInTheDocument();
      });
      expect(screen.queryByText('Cancel Candidate')).not.toBeInTheDocument();
    });
  });

  test('shows error message if getReservationsFromStorage throws an error', async () => {
    getReservationsFromStorage.mockImplementation(() => {
      throw new Error('Storage failed');
    });
    render(<ReservationList />);
    await waitFor(() => {
      expect(screen.getByText('Failed to load reservations. Please try again later.')).toBeInTheDocument();
    });
  });

});
