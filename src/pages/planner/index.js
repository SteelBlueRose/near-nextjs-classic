import React, { useState, useContext } from 'react';
import styles from '@/styles/Planner.module.css';
import { NearContext } from '@/context';
import { useNear } from '@/hooks/useNear';

const Planner = () => {
  const { signedAccountId } = useContext(NearContext);
  const { workingHours } = useNear(signedAccountId);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const handlePrevWeek = () => {
    setCurrentWeek(prevWeek => {
      const newWeek = new Date(prevWeek);
      newWeek.setDate(newWeek.getDate() - 7);
      return newWeek;
    });
  };

  const handleNextWeek = () => {
    setCurrentWeek(prevWeek => {
      const newWeek = new Date(prevWeek);
      newWeek.setDate(newWeek.getDate() + 7);
      return newWeek;
    });
  };

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday as start of the week
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const isWithinWorkingHours = (day, hour) => {
    if (!workingHours) return false;

    const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const userWorkingHours = workingHours?.[dayOfWeek];

    if (!userWorkingHours) return false;

    const startTime = parseFloat(userWorkingHours.start_time);
    const endTime = parseFloat(userWorkingHours.end_time);

    return hour >= startTime && hour < endTime;
  };

  const weekDays = getWeekDays(currentWeek);

  return (
    <div className={styles.plannerContainer}>
      <div className={styles.header}>
        <button onClick={handlePrevWeek}>&larr;</button>
        <div className={styles.currentMonthYear}>
          {currentWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <button onClick={handleNextWeek}>&rarr;</button>
      </div>
      <div className={styles.calendar}>
        <div className={styles.hoursColumn}>
          {Array.from({ length: 24 }).map((_, hour) => (
            <div key={hour}>{`${hour}:00`}</div>
          ))}
        </div>
        <div className={styles.weekDays}>
          {weekDays.map((day, index) => (
            <div key={index} className={styles.dayColumn}>
              <div className={styles.dayHeader}>
                <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div>{day.getDate()}</div>
              </div>
              <div className={styles.timeSlots}>
                {Array.from({ length: 24 }).map((_, hour) => (
                  <div
                    key={hour}
                    className={`${styles.timeSlot} ${isWithinWorkingHours(day, hour) ? styles.highlight : ''}`}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Planner;