import React, { useState, useEffect, useContext } from 'react';
import { NearContext } from '@/context';
import AddBreakForm from '@/components/AddBreakForm';
import EditBreaksForm from '@/components/EditBreaksForm';
import { useNear } from '@/hooks/useNear';
import styles from '@/styles/Planner.module.css';

const Planner = () => {
  const { signedAccountId } = useContext(NearContext);
  const { breaks, fetchBreaks, addBreak, updateBreak, removeBreak, workingHours } = useNear(signedAccountId, 'week');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isAddBreakFormOpen, setAddBreakFormOpen] = useState(false);
  const [isEditBreaksFormOpen, setEditBreaksFormOpen] = useState(false);

  useEffect(() => {
    if (signedAccountId) {
      fetchBreaks(signedAccountId);
    }
  }, [signedAccountId, fetchBreaks]);

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

  const isWorkingHour = (day, hour) => {
    if (!workingHours || !workingHours[day]) return false;
    const { start_time, end_time } = workingHours[day];
    return hour >= start_time && hour < end_time;
  };

  const isBreakHour = (day, hour, halfHour) => {
    if (!breaks) return false;
    const regularBreaks = breaks.regular_breaks || [];
    const oneTimeBreaks = breaks.one_time_breaks || [];

    const timeToFloat = (hour, halfHour) => hour + (halfHour ? 0.5 : 0);

    // Check regular breaks
    for (const break_ of regularBreaks) {
      if (timeToFloat(hour, halfHour) >= break_.start_time && timeToFloat(hour, halfHour) < break_.end_time) {
        return true;
      }
    }

    // Check one-time breaks for the specific day
    for (const break_ of oneTimeBreaks) {
      const breakDate = new Date(break_.date).toDateString();
      const currentDay = new Date(day).toDateString();
      if (breakDate === currentDay) {
        if (timeToFloat(hour, halfHour) >= break_.start_time && timeToFloat(hour, halfHour) < break_.end_time) {
          return true;
        }
      }
    }

    return false;
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
        <div className={styles.buttonContainer}>
          <button onClick={() => setAddBreakFormOpen(true)}>Add Break</button>
          <button onClick={() => setEditBreaksFormOpen(true)}>Edit Breaks</button>
        </div>
      </div>
      <div className={styles.calendar}>
        <div className={styles.hoursColumn}>
          {Array.from({ length: 24 }).map((_, hour) => (
            <div key={hour}>{`${hour}:00`}</div>
          ))}
        </div>
        <div className={styles.weekDays}>
          {weekDays.map((day, index) => {
            const dayName = day.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            return (
              <div key={index} className={styles.dayColumn}>
                <div className={styles.dayHeader}>
                  <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div>{day.getDate()}</div>
                </div>
                <div className={styles.timeSlots}>
                  {Array.from({ length: 24 }).map((_, hour) => (
                    <React.Fragment key={hour}>
                      <div
                        className={`${styles.timeSlot} ${isWorkingHour(dayName, hour) ? styles.highlight : ''} ${isBreakHour(day, hour, false) ? styles.breakHighlight : ''}`}
                      ></div>
                      <div
                        className={`${styles.timeSlot} ${isWorkingHour(dayName, hour + 0.5) ? styles.highlight : ''} ${isBreakHour(day, hour, true) ? styles.breakHighlight : ''}`}
                      ></div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <AddBreakForm
        isOpen={isAddBreakFormOpen}
        onClose={() => setAddBreakFormOpen(false)}
        addBreak={addBreak}
      />
      <EditBreaksForm
        isOpen={isEditBreaksFormOpen}
        onClose={() => setEditBreaksFormOpen(false)}
        breaks={breaks}
        updateBreak={updateBreak}
        removeBreak={removeBreak}
      />
    </div>
  );
};

export default Planner;
