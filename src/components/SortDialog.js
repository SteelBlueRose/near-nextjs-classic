import React from 'react';
import styles from '@/styles/Dialog.module.css';

const SortDialog = ({ isSortDialogOpen, setIsSortDialogOpen, sortType, setSortType, sortOrder, setSortOrder }) => {
  return isSortDialogOpen && (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialog}>
        <h2>Sort Tasks</h2>
        <select value={sortType} onChange={(e) => setSortType(e.target.value)} className={styles.taskInput}>
          <option value="time">Time Estimated</option>
          <option value="deadline">Deadline</option>
          <option value="reward_points">Reward Points</option>
        </select>
        <p className={styles.inputTip}>Sort by</p>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={styles.taskInput}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <p className={styles.inputTip}>Order</p>
        <div className={styles.taskButtons}>
          <button className="btn btn-success" onClick={() => setIsSortDialogOpen(false)}>Apply</button>
          <button className="btn btn-secondary" onClick={() => setIsSortDialogOpen(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SortDialog;
