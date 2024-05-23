import React from 'react';
import styles from '@/styles/Dialog.module.css';

const PeriodDialog = ({ isOpen, onClose, setPeriod }) => {
  return isOpen && (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialog}>
        <h2>Select Period</h2>
        <button className="btn btn-primary" onClick={() => { setPeriod('week'); onClose(); }}>This Week</button>
        <button className="btn btn-primary" onClick={() => { setPeriod('month'); onClose(); }}>This Month</button>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default PeriodDialog;
