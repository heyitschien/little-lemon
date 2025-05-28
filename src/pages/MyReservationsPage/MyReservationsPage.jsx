import React from 'react';
import styles from './MyReservationsPage.module.css';
import ReservationList from '../../components/Reservation/ReservationList';

/**
 * MyReservationsPage Component
 * 
 * Displays a page showing all upcoming reservations for the user.
 */
const MyReservationsPage = () => {
  return (
    <div className={styles.myReservationsPageWrapper}>
      <h1 className={styles.pageTitle}>My Reservations</h1>
      <div className={styles.myReservationsPage}>      
        <ReservationList />
      </div>
    </div>
  );
};

export default MyReservationsPage;
