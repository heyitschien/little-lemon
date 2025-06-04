---
Title: LocalStorage Implementation for Reservation History
Author: Chien Escalera Duong
Date Created: 2025-06-03
Time Created: 17:52:00 PDT
Last Updated: 2025-06-03 17:52:00 PDT
Version: 1.0
---

# LocalStorage Implementation for Reservation History

## Overview

This document outlines the implementation plan for adding localStorage support to the Little Lemon reservation system. This enhancement will allow the application to store reservation history locally in the user's browser, enabling users to view their past reservations even after closing and reopening the application.

## Business Requirements

1. Store confirmed reservations in the browser's localStorage
2. Retrieve past reservations when the application loads
3. Display a list of past reservations to the user
4. Meet course requirements for data persistence

## Technical Design

### 1. Data Structure

Reservations will be stored in localStorage using the following structure:

```javascript
// Key for localStorage
const STORAGE_KEY = 'littleLemonReservations';

// Example data structure
const reservations = [
  {
    id: 'LL-1717627200000',
    date: '2025-06-05',
    time: '18:00',
    partySize: '4',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    occasion: 'birthday',
    specialRequests: 'Window table please',
    confirmedAt: '2025-06-03T17:52:00.000Z'
  },
  // Additional reservations...
];
```

### 2. Implementation Details

#### 2.1 Update useReservation Hook

The `useReservation` hook will be enhanced to handle localStorage operations:

```javascript
// Add state for past reservations
const [pastReservations, setPastReservations] = useState([]);

// Load past reservations on component mount
useEffect(() => {
  const loadPastReservations = () => {
    try {
      const storedReservations = localStorage.getItem('littleLemonReservations');
      if (storedReservations) {
        setPastReservations(JSON.parse(storedReservations));
      }
    } catch (error) {
      console.error('Error loading past reservations:', error);
    }
  };
  
  loadPastReservations();
  // ... existing code for fetchInitialTimes
}, []);

// Update handleConfirmReservation to save to localStorage
const handleConfirmReservation = async () => {
  // ... existing code
  
  if (submissionSuccessful) {
    const newReservation = { 
      ...reservationData, 
      id: `LL-${Date.now()}`,
      confirmedAt: new Date().toISOString() 
    };
    
    setConfirmedReservation(newReservation);
    
    // Update localStorage with the new reservation
    try {
      const updatedReservations = [...pastReservations, newReservation];
      localStorage.setItem('littleLemonReservations', JSON.stringify(updatedReservations));
      setPastReservations(updatedReservations);
    } catch (error) {
      console.error('Error saving reservation to localStorage:', error);
    }
    
    setCurrentStep(4);
    return true;
  }
  
  // ... existing error handling code
};

// Add getPastReservations to the returned object
return {
  // ... existing returned properties
  pastReservations,
  getPastReservations: () => pastReservations,
};
```

#### 2.2 Create ReservationList Component

A new component will be created to display past reservations:

```jsx
// src/components/features/Reservation/ReservationList.jsx
import React from 'react';
import styles from './ReservationList.module.css';

const ReservationList = ({ reservations }) => {
  if (!reservations || reservations.length === 0) {
    return <p>No past reservations found.</p>;
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

  return (
    <div className={styles.reservationList}>
      <h2>Your Reservations</h2>
      {reservations.map((reservation) => (
        <div key={reservation.id} className={styles.reservationCard}>
          <div className={styles.reservationHeader}>
            <h3>Reservation #{reservation.id}</h3>
            {reservation.confirmedAt && (
              <span className={styles.confirmedDate}>
                Confirmed on {new Date(reservation.confirmedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className={styles.reservationDetails}>
            <p><strong>Date:</strong> {formatDate(reservation.date)}</p>
            <p><strong>Time:</strong> {formatTime(reservation.time)}</p>
            <p><strong>Party Size:</strong> {reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}</p>
            <p><strong>Name:</strong> {reservation.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservationList;
```

#### 2.3 Create MyReservationsPage Component

A new page will be created to display the reservation history:

```jsx
// src/pages/MyReservationsPage/MyReservationsPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MyReservationsPage.module.css';
import ReservationList from '../../components/features/Reservation/ReservationList';
import { useReservation } from '../../hooks/useReservation';

const MyReservationsPage = () => {
  const { pastReservations } = useReservation();
  
  return (
    <div className={styles.myReservationsPage}>
      <h1>My Reservations</h1>
      <ReservationList reservations={pastReservations} />
      
      <div className={styles.actions}>
        <Link to="/reservation" className={styles.newReservationButton}>
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
```

#### 2.4 Update Routing Configuration

Add a new route for the MyReservationsPage:

```jsx
// In App.jsx or routing configuration
<Route path="/my-reservations" element={<MyReservationsPage />} />
```

#### 2.5 Update Navigation

Add a link to the My Reservations page in the navigation:

```jsx
// In Nav.jsx or header component
<Link to="/my-reservations">My Reservations</Link>
```

### 3. CSS Styling

Create a new CSS module for the ReservationList component:

```css
/* src/components/features/Reservation/ReservationList.module.css */
.reservationList {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.reservationCard {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 16px;
  border-left: 4px solid #495E57;
}

.reservationHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.reservationHeader h3 {
  margin: 0;
  color: #495E57;
  font-size: 1.2rem;
}

.confirmedDate {
  font-size: 0.8rem;
  color: #666;
}

.reservationDetails p {
  margin: 8px 0;
}
```

Create a new CSS module for the MyReservationsPage:

```css
/* src/pages/MyReservationsPage/MyReservationsPage.module.css */
.myReservationsPage {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.myReservationsPage h1 {
  color: #495E57;
  margin-bottom: 30px;
  text-align: center;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.newReservationButton, .homeButton {
  display: inline-block;
  padding: 12px 24px;
  background-color: #F4CE14;
  color: #333;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.homeButton {
  background-color: #EDEFEE;
}

.newReservationButton:hover {
  background-color: #E1C414;
}

.homeButton:hover {
  background-color: #D9DBDA;
}
```

## Testing Strategy

### Unit Tests

1. Test localStorage saving and retrieving in the useReservation hook
2. Test the ReservationList component with various data scenarios
3. Test the MyReservationsPage component

### Manual Testing

1. Complete a reservation and verify it's saved to localStorage
2. Refresh the page and verify past reservations are loaded
3. Make multiple reservations and verify all are displayed
4. Test with localStorage disabled or full

## Error Handling

1. Handle localStorage access errors gracefully
2. Provide user feedback when localStorage is not available
3. Implement data validation before storing/retrieving

## Security Considerations

1. Do not store sensitive information in localStorage
2. Consider encrypting data if necessary
3. Implement data size limits to prevent localStorage quota issues

## Future Enhancements

1. Add ability to delete past reservations
2. Implement reservation editing functionality
3. Add filters for sorting and searching reservations
4. Consider syncing with a backend database for persistent storage across devices

## Implementation Timeline

1. Update useReservation hook - 2 hours
2. Create ReservationList component - 2 hours
3. Create MyReservationsPage - 1 hour
4. Update routing and navigation - 30 minutes
5. Styling and UI refinements - 2 hours
6. Testing and bug fixes - 2 hours

Total estimated time: 9.5 hours

## Conclusion

This implementation will enhance the Little Lemon reservation system by providing users with a history of their reservations that persists between browser sessions. It meets the course requirements for data storage while providing a foundation for future enhancements.
