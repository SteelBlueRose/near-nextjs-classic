import React, { useState } from 'react';
import styles from '@/styles/AddBreakForm.module.css';

const AddBreakForm = ({ isOpen, onClose, addBreak }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isRegular, setIsRegular] = useState(false);
  const [date, setDate] = useState('');

  const handleSave = () => {
    const start_time = parseFloat(startTime.replace(':', '.'));
    const end_time = parseFloat(endTime.replace(':', '.'));
    if (start_time < end_time) {
      addBreak(start_time, end_time, isRegular, isRegular ? null : new Date(date).getTime());
      onClose();
    } else {
      alert('Start time must be before end time.');
    }
  };

  return isOpen && (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialog}>
        <h2>Add Break</h2>
        <div className={styles.formGroup}>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <p className={styles.inputTip}>Start time</p>
        </div>
        <div className={styles.formGroup}>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
          <p className={styles.inputTip}>End time</p>
        </div>
        {!isRegular && (
          <div className={styles.formGroup}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <p className={styles.inputTip}>Date</p>
          </div>
        )}
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={isRegular}
            onChange={(e) => setIsRegular(e.target.checked)}
          />
          <label>Make regular</label>
        </div>
        <div className={styles.taskButtons}>
          <button className="btn btn-success" onClick={handleSave}>Save</button>
          <button className="btn btn-danger" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddBreakForm;
