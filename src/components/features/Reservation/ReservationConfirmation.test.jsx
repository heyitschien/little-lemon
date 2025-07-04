import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReservationConfirmation from './ReservationConfirmation';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { axe } from 'jest-axe';

describe('ReservationConfirmation Component', () => {
  const mockOnConfirm = vi.fn();
  const mockOnModify = vi.fn();

  const baseReservationData = {
    date: '2025-07-15', // Tuesday, July 15, 2025
    time: '19:00', // 7:00 PM
    partySize: 2,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    occasion: '',
    specialRequests: '',
    id: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders basic static elements', () => {
    render(
      <ReservationConfirmation 
        reservationData={baseReservationData} 
        onConfirm={mockOnConfirm} 
        onModify={mockOnModify} 
      />
    );
    expect(screen.getByText('Reservation Summary')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm reservation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Modify reservation' })).toBeInTheDocument();
    expect(screen.getByText(/Please arrive 10 minutes before your reservation time/i)).toBeInTheDocument();
    expect(screen.getByText(/To cancel or modify your reservation, please call us/i)).toBeInTheDocument();
  });

  test('displays all provided reservation data correctly', () => {
    const fullData = {
      ...baseReservationData,
      id: 'CONF123',
      occasion: 'birthday',
      specialRequests: 'Window seat, please.',
    };
    render(
      <ReservationConfirmation 
        reservationData={fullData} 
        onConfirm={mockOnConfirm} 
        onModify={mockOnModify} 
      />
    );

    // Date and Time (formatted)
    expect(screen.getByText('Tuesday, July 15, 2025')).toBeInTheDocument();
    expect(screen.getByText('7:00 PM')).toBeInTheDocument();
    expect(screen.getByText('2 people')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    
    // Conditional fields
    expect(screen.getByText('Confirmation #CONF123')).toBeInTheDocument();
    expect(screen.getByText('Birthday')).toBeInTheDocument(); // Capitalized
    expect(screen.getByText('Window seat, please.')).toBeInTheDocument();
  });

  test('handles missing optional data gracefully', () => {
    const minimalData = {
      ...baseReservationData, // occasion, specialRequests, id are empty strings here
      partySize: 1,
    };
    render(
      <ReservationConfirmation 
        reservationData={minimalData} 
        onConfirm={mockOnConfirm} 
        onModify={mockOnModify} 
      />
    );

    expect(screen.getByText('Tuesday, July 15, 2025')).toBeInTheDocument();
    expect(screen.getByText('7:00 PM')).toBeInTheDocument();
    expect(screen.getByText('1 person')).toBeInTheDocument(); // Singular
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    expect(screen.queryByText(/Confirmation #/i)).not.toBeInTheDocument();
    // Check that labels for optional fields are not there if data is missing
    // The component structure is <span class="summaryLabel">Occasion:</span> <span class="summaryValue">...</span>
    // So we query for the text 'Occasion:' to ensure the whole item isn't rendered.
    expect(screen.queryByText('Occasion:')).not.toBeInTheDocument();
    expect(screen.queryByText('Special Requests:')).not.toBeInTheDocument();
  });

  test('calls onConfirm when "Confirm Reservation" button is clicked', () => {
    render(
      <ReservationConfirmation 
        reservationData={baseReservationData} 
        onConfirm={mockOnConfirm} 
        onModify={mockOnModify} 
      />
    );
    const confirmButton = screen.getByRole('button', { name: 'Confirm reservation' });
    fireEvent.click(confirmButton);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnModify).not.toHaveBeenCalled();
  });

  test('calls onModify when "Modify" button is clicked', () => {
    render(
      <ReservationConfirmation 
        reservationData={baseReservationData} 
        onConfirm={mockOnConfirm} 
        onModify={mockOnModify} 
      />
    );
    const modifyButton = screen.getByRole('button', { name: 'Modify reservation' });
    fireEvent.click(modifyButton);
    expect(mockOnModify).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  test('formats AM times correctly', () => {
    const amData = { ...baseReservationData, time: '08:30' }; // 8:30 AM
    render(
      <ReservationConfirmation 
        reservationData={amData} 
        onConfirm={mockOnConfirm} 
        onModify={mockOnModify} 
      />
    );
    expect(screen.getByText('8:30 AM')).toBeInTheDocument();
  });

  test('formats 12 AM (midnight) times correctly', () => {
    const midnightData = { ...baseReservationData, time: '00:15' }; // 12:15 AM
    render(
      <ReservationConfirmation 
        reservationData={midnightData} 
        onConfirm={mockOnConfirm} 
        onModify={mockOnModify} 
      />
    );
    expect(screen.getByText('12:15 AM')).toBeInTheDocument();
  });

  test('formats 12 PM (noon) times correctly', () => {
    const noonData = { ...baseReservationData, time: '12:45' }; // 12:45 PM
    render(
      <ReservationConfirmation 
        reservationData={noonData} 
        onConfirm={mockOnConfirm} 
        onModify={mockOnModify} 
      />
    );
    expect(screen.getByText('12:45 PM')).toBeInTheDocument();
  });

  test('handles empty date string gracefully', () => {
    const noDateData = { ...baseReservationData, date: '' };
    render(
      <ReservationConfirmation 
        reservationData={noDateData} 
        onConfirm={mockOnConfirm} 
        onModify={mockOnModify} 
      />
    );
    // Check that the date value is empty or not present in a way that breaks rendering
    // Assuming the structure is <span class="summaryLabel">Date:</span><span class="summaryValue"></span>
    const dateLabel = screen.getByText('Date:');
    const dateValueSpan = dateLabel.nextElementSibling;
    expect(dateValueSpan.textContent).toBe('');
  });

  test('handles empty time string gracefully', () => {
    const noTimeData = { ...baseReservationData, time: '' };
    render(
      <ReservationConfirmation 
        reservationData={noTimeData} 
        onConfirm={mockOnConfirm} 
        onModify={mockOnModify} 
      />
    );
    const timeLabel = screen.getByText('Time:');
    const timeValueSpan = timeLabel.nextElementSibling;
    expect(timeValueSpan.textContent).toBe('');
  });

  describe('Accessibility', () => {
    test('renders a main heading for the confirmation section', () => {
      render(
        <ReservationConfirmation 
          reservationData={baseReservationData} 
          onConfirm={mockOnConfirm} 
          onModify={mockOnModify} 
        />
      );
      // We expect an H2 heading with the text "Reservation Confirmation"
      // This will likely fail as the component currently has an H3 "Reservation Summary"
      // and a commented out H2.
      expect(screen.getByRole('heading', { level: 2, name: /Reservation Confirmation/i })).toBeInTheDocument();
    });

    test('passes basic axe accessibility checks', async () => {
      const { container } = render(
        <ReservationConfirmation 
          reservationData={baseReservationData} 
          onConfirm={mockOnConfirm} 
          onModify={mockOnModify} 
        />
      );
      // Basic axe check
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
