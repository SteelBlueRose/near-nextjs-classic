import React, { useState, useEffect } from 'react';
import settings_styles from '@/styles/SettingsForm.module.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultWorkingHours = {
  monday: { start_time: '09:00', end_time: '16:00' },
  tuesday: { start_time: '09:00', end_time: '16:00' },
  wednesday: { start_time: '09:00', end_time: '16:00' },
  thursday: { start_time: '09:00', end_time: '16:00' },
  friday: { start_time: '09:00', end_time: '16:00' },
  saturday: { start_time: '09:00', end_time: '16:00' },
  sunday: { start_time: '09:00', end_time: '16:00' },
};

const timeStringToFloat = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours + minutes / 60;
};

const SettingsForm = ({ isOpen, onClose, saveWorkingHours, initialWorkingHours, showMessage }) => {
  const [workingHours, setWorkingHours] = useState(defaultWorkingHours);

  useEffect(() => {
    if (initialWorkingHours) {
      setWorkingHours(initialWorkingHours);
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
