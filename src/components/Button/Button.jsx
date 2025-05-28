import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.css';

const Button = ({ 
  children,
  to,
  onClick,
  type = 'button', // Default to 'button' type for <button> elements
  variant = 'primary', // 'primary', 'secondary'
  disabled = false,
  className = '', // Allow custom classes
  ariaLabel,
  ...props 
}) => {
  const buttonClasses = `
    ${styles.button}
    ${variant === 'secondary' ? styles.secondary : ''}
    ${disabled ? styles.disabled : ''}
    ${className}
  `.trim();

  if (to) {
    return (
      <Link 
        to={to} 
        className={buttonClasses} 
        onClick={onClick} // onClick can still be useful for Links, e.g., for tracking
        aria-label={ariaLabel || children}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button 
      type={type} 
      className={buttonClasses} 
      onClick={onClick} 
      disabled={disabled}
      aria-label={ariaLabel || children}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
