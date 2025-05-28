// Placeholder for Modal
import React from 'react';
// import styles from './Modal.module.css'; // Uncomment when styles are added

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div /*className={styles.overlay}*/ style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div /*className={styles.modal}*/ style={{backgroundColor: 'white', padding: '20px', borderRadius: '8px', minWidth: '300px'}}>
        <h2>{title}</h2>
        <div>{children}</div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
