import React, { useState, useEffect } from 'react';
import styles from '@/styles/EditBreakForm.module.css';

const EditBreaksForm = ({ isOpen, onClose, breaks, updateBreak, removeBreak }) => {
  const [breaksList, setBreaksList] = useState([]);

  useEffect(() => {
    setBreaksList([...breaks.regular_breaks, ...breaks.one_time_breaks]);
  }, [breaks]);

  const formatTime = (time) => {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().substring(0, 10);
  };

  const handleUpdate = (breakIndex, newStartTime, newEndTime, newDate) => {
    const selectedBreak = breaksList[breakIndex];
    const old_start_time = selectedBreak.start_time;
    const old_end_time = selectedBreak.end_time;
    const new_start_time = parseFloat(newStartTime.replace(':', '.'));
    const new_end_time = parseFloat(newEndTime.replace(':', '.'));
    if (new_start_time < new_end_time) {
      updateBreak(old_start_time, old_end_time, new_start_time, new_end_time, selectedBreak.is_regular, selectedBreak.is_regular ? null : new Date(newDate).getTime());
    } else {
      alert('Start time must be before end time.');
    }
  };

  const handleRemove = (breakIndex) => {
    const selectedBreak = breaksList[breakIndex];
    removeBreak(selectedBreak.start_time, selectedBreak.end_time, selectedBreak.is_regular, selectedBreak.date);
  };

  return isOpen && (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialog}>
        <h2>Edit Breaks</h2>
        
        {breaks.regular_breaks.length > 0 && <h3>Regular Breaks</h3>}
        {breaks.regular_breaks.map((break_, index) => (
          <div key={index} className={styles.breakCard}>
            <input
              type="time"
              value={formatTime(break_.start_time)}
              onChange={(e) => handleUpdate(index, e.target.value, formatTime(break_.end_time))}
              required
            />
            <input
              type="time"
              value={formatTime(break_.end_time)}
              onChange={(e) => handleUpdate(index, formatTime(break_.start_time), e.target.value)}
              required
            />
            <button className="btn btn-success" onClick={() => handleUpdate(index, formatTime(break_.start_time), formatTime(break_.end_time))}>Update</button>
            <button className="btn btn-danger" onClick={() => handleRemove(index)}>Remove</button>
          </div>
        ))}

        {breaks.one_time_breaks.length > 0 && <h3>One-time Breaks</h3>}
        {breaks.one_time_breaks.map((break_, index) => (
          <div key={index + breaks.regular_breaks.length} className={styles.breakCard}>
            <input
              type="time"
              value={formatTime(break_.start_time)}
              onChange={(e) => handleUpdate(index + breaks.regular_breaks.length, e.target.value, formatTime(break_.end_time), formatDate(break_.date))}
              required
            />
            <input
              type="time"
              value={formatTime(break_.end_time)}
              onChange={(e) => handleUpdate(index + breaks.regular_breaks.length, formatTime(break_.start_time), e.target.value, formatDate(break_.date))}
              required
            />
            <input
              type="date"
              value={formatDate(break_.date)}
              onChange={(e) => handleUpdate(index + breaks.regular_breaks.length, formatTime(break_.start_time), formatTime(break_.end_time), e.target.value)}
              required
            />
            <button className="btn btn-success" onClick={() => handleUpdate(index + breaks.regular_breaks.length, formatTime(break_.start_time), formatTime(break_.end_time), formatDate(break_.date))}>Update</button>
            <button className="btn btn-danger" onClick={() => handleRemove(index + breaks.regular_breaks.length)}>Remove</button>
          </div>
        ))}

        <div className={styles.taskButtons}>
          <button className="btn btn-danger" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EditBreaksForm;
