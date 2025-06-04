import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MyReservationsPage.module.css';
import ReservationList from '../../components/features/Reservation/ReservationList';
import { useReservation } from '../../hooks/useReservation';

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
        <Link to="/reservations" className={styles.newReservationButton}>
          Make a New Reservation
        </Link>
        <Link to="/" className={styles.homeButton}>
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default MyReservationsPage;
