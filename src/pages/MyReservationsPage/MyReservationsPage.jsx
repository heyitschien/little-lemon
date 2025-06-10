import React from 'react';
import styles from './MyReservationsPage.module.css';
import ReservationList from '../../components/features/Reservation/ReservationList';
import { useReservation } from '../../hooks/useReservation';
import Button from '../../components/common/Button/Button';

/**
 * MyReservationsPage Component
 * 
 * Displays a page showing all upcoming reservations for the user.
 */
const MyReservationsPage = () => {
  const { pastReservations, removeReservationById } = useReservation();

  return (
    <div className={styles.myReservationsPage}>
      <h1>My Reservations</h1>
      <ReservationList reservations={pastReservations} removeReservationById={removeReservationById} />
      
      <div className={styles.actions}>
        <Button to="/reservations" variant="primary">
          Make a New Reservation
        </Button>
        <Button to="/" variant="secondary">
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default MyReservationsPage;
