import React, { useState, useEffect } from 'react';
import settings_styles from '@/styles/SettingsForm.module.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const timeStringToFloat = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours + minutes / 60;
};

const floatToTimeString = (timeFloat) => {
  const hours = Math.floor(timeFloat);
  const minutes = Math.round((timeFloat - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const SettingsForm = ({ isOpen, onClose, saveWorkingHours, initialWorkingHours, showMessage }) => {
  const [workingHours, setWorkingHours] = useState({});

  useEffect(() => {
    if (initialWorkingHours) {
      const formattedWorkingHours = {};
      for (const [day, hours] of Object.entries(initialWorkingHours)) {
        formattedWorkingHours[day] = {
          start_time: floatToTimeString(hours.start_time),
          end_time: floatToTimeString(hours.end_time),
        };
      }
      setWorkingHours(formattedWorkingHours);
    }
  }, [initialWorkingHours]);

  const handleChange = (day, field, value) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day.toLowerCase()]: {
        ...prev[day.toLowerCase()],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedWorkingHours = {};
    for (const [day, hours] of Object.entries(workingHours)) {
      formattedWorkingHours[day] = {
        start_time: timeStringToFloat(hours.start_time),
        end_time: timeStringToFloat(hours.end_time),
      };
    }
    saveWorkingHours(formattedWorkingHours);
    onClose();
  };

  return (
    <div className={`${settings_styles.dialogOverlay} ${isOpen ? settings_styles.show : ''}`}>
      <div className={settings_styles.dialog}>
        <h2>Working Hours</h2>
        {showMessage && <p>Please set your working hours.</p>}
        <form onSubmit={handleSubmit}>
          {daysOfWeek.map((day) => (
            <div key={day} className={settings_styles.dayBlock}>
              <div className={settings_styles.dayRow}>
                <label>{day} Start:</label>
                <input
                  type="time"
                  value={workingHours[day.toLowerCase()]?.start_time || ''}
                  onChange={(e) => handleChange(day, 'start_time', e.target.value)}
                  required
                />
                <label>End:</label>
                <input
                  type="time"
                  value={workingHours[day.toLowerCase()]?.end_time || ''}
                  onChange={(e) => handleChange(day, 'end_time', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
          <div className={settings_styles.dialogActions}>
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsForm;
