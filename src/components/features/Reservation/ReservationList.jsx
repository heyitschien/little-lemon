import React from 'react';
import styles from './ReservationList.module.css';

const ReservationList = ({ reservations, removeReservationById }) => {
  if (!reservations || reservations.length === 0) {
    return <p className={styles.noReservationsMessage}>No past reservations found.</p>;
  }

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hoursNum = parseInt(hours, 10);
    const period = hoursNum >= 12 ? 'PM' : 'AM';
    const hours12 = hoursNum % 12 || 12;
    return `${hours12}:${minutes} ${period}`;
  };

  const formatConfirmedAt = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <ul className={styles.reservationList}>
      {/* Removed H2 "Your Reservations" as MyReservationsPage provides an H1 */}
      {reservations.map((reservation) => (
        <li key={reservation.id} className={styles.reservationCard}>
          <div className={styles.cardTitleHeader}>
            <h3 className={styles.cardTitle}>Reservation for {formatDate(reservation.date)}</h3>
            <span className={styles.cardSubTitle}>Confirmed: {formatConfirmedAt(reservation.confirmedAt)}</span>
          </div>
          <div className={styles.reservationDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Time:</span>
              <span className={styles.detailValue}>{formatTime(reservation.time)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Party Size:</span>
              <span className={styles.detailValue}>{reservation.partySize} {parseInt(reservation.partySize, 10) === 1 ? 'person' : 'people'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Name:</span>
              <span className={styles.detailValue}>{reservation.name}</span>
            </div>
            {reservation.email && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email:</span>
                <span className={styles.detailValue}>{reservation.email}</span>
              </div>
            )}
            {reservation.phone && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Phone:</span>
                <span className={styles.detailValue}>{reservation.phone}</span>
              </div>
            )}
            {reservation.occasion && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Occasion:</span>
                <span className={styles.detailValue}>{reservation.occasion}</span>
              </div>
            )}
            {reservation.specialRequests && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Requests:</span>
                <span className={styles.detailValue}>{reservation.specialRequests}</span>
              </div>
            )}
          </div>
          <div className={styles.cardActions}>
            <button 
              onClick={() => {
                if (window.confirm('Are you sure you want to remove this reservation?')) {
                  removeReservationById(reservation.id);
                }
              }}
              className={`${styles.button} ${styles.removeButton}`}
              aria-label={`Remove reservation for ${reservation.name} on ${formatDate(reservation.date)}`}
            >
              Remove Reservation
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ReservationList;
