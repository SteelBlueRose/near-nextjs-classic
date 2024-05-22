import React, { useState, useEffect } from 'react';
import styles from '@/styles/CurrentDateTime.module.css';

const CurrentDateTime = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000);
  
      return () => {
        clearInterval(timer);
      };
    }, []);
  
    const formatDate = (date) => {
      return date.toLocaleDateString('en-GB');
    };
  
    const formatTime = (date) => {
      return date.toLocaleTimeString('en-GB');
    };
  
    return (
      <div className={styles.dateTimeContainer}>
        <p className={styles.date}>{formatDate(currentDateTime)}</p>
        <p className={styles.time}>{formatTime(currentDateTime)}</p>
      </div>
    );
  };

export default CurrentDateTime;