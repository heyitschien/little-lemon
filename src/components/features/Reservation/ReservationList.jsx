import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ReservationList.module.css';
import { getReservationsFromStorage, cancelReservation } from '../../../services/reservationService';

/**
 * ReservationList Component
 * 
 * Displays a list of upcoming reservations for the user with options to view, modify, or cancel.
 */
const ReservationList = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load reservations on component mount
  useEffect(() => {
    try {
      const userReservations = getReservationsFromStorage();
      // Sort reservations by date and time (most recent first)
      const sortedReservations = userReservations.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
      });
      
      // Filter out past reservations
      const now = new Date();
      const upcomingReservations = sortedReservations.filter(reservation => {
        const reservationDate = new Date(`${reservation.date}T${reservation.time}`);
        return reservationDate > now;
      });
      
      setReservations(upcomingReservations);
      setLoading(false);
    } catch (err) {
      console.error('Error loading reservations:', err);
      setError('Failed to load reservations. Please try again later.');
      setLoading(false);
    }
  }, []);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };
  
  // Handle cancellation of a reservation
  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        const success = cancelReservation(id);
        if (success) {
          // Update the local state to remove the cancelled reservation
          setReservations(reservations.filter(res => res.id !== id));
        } else {
          setError('Failed to cancel reservation. Please try again.');
        }
      } catch (err) {
        console.error('Error cancelling reservation:', err);
        setError('An error occurred while cancelling the reservation.');
      }
    }
  };
  
  // Handle modification of a reservation
  const handleModify = (id) => {
    // In a real application, this would navigate to a modification page with the reservation pre-filled
    navigate(`/reservations/modify/${id}`);
  };
  
  // Handle creating a new reservation
  const handleNewReservation = () => {
    navigate('/reservations');
  };
  
  if (loading) {
    return <div className={styles.loadingMessage}>Loading your reservations...</div>;
  }
  
  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }
  
  return (
    <div className={styles.reservationListContainer}>
      <h2 className={styles.sectionTitle}>Your Upcoming Reservations</h2>
      
      {reservations.length === 0 ? (
        <div className={styles.noReservations}>
          <p>You don't have any upcoming reservations.</p>
          <button 
            className={styles.newReservationButton}
            onClick={handleNewReservation}
          >
            Make a Reservation
          </button>
        </div>
      ) : (
        <>
          <div className={styles.reservationList}>
            {reservations.map(reservation => (
              <div key={reservation.id} className={styles.reservationCard}>
                <div className={styles.reservationHeader}>
                  <div className={styles.dateTime}>
                    <span className={styles.date}>{formatDate(reservation.date)}</span>
                    <span className={styles.time}>{formatTime(reservation.time)}</span>
                  </div>
                  <div className={styles.partySize}>
                    {reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}
                  </div>
                </div>
                
                <div className={styles.reservationDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Name:</span>
                    <span className={styles.detailValue}>{reservation.name}</span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Email:</span>
                    <span className={styles.detailValue}>{reservation.email}</span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Phone:</span>
                    <span className={styles.detailValue}>{reservation.phone}</span>
                  </div>
                  
                  {reservation.occasion && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Occasion:</span>
                      <span className={styles.detailValue}>{reservation.occasion}</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.reservationActions}>
                  <button 
                    className={`${styles.actionButton} ${styles.modifyButton}`}
                    onClick={() => handleModify(reservation.id)}
                    aria-label={`Modify reservation for ${reservation.name}`}
                  >
                    Modify
                  </button>
                  
                  <button 
                    className={`${styles.actionButton} ${styles.cancelButton}`}
                    onClick={() => handleCancel(reservation.id)}
                    aria-label={`Cancel reservation for ${reservation.name}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.newReservationContainer}>
            <button 
              className={styles.newReservationButton}
              onClick={handleNewReservation}
            >
              Make Another Reservation
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReservationList;
