import React, { useState } from 'react';
import styles from '@/styles/Dialog.module.css';

const RewardForm = ({ isAddRewardDialogOpen, setIsAddRewardDialogOpen, addReward }) => {
  const [newReward, setNewReward] = useState({
    title: '',
    description: '',
    cost: 0,
  });

  return isAddRewardDialogOpen && (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialog}>
        <h2>Add Reward</h2>
        <input
          type="text"
          placeholder="Title"
          value={newReward.title}
          onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
          className={styles.taskInput}
        />
        <p className={styles.inputTip}>Title</p>
        <input
          type="text"
          placeholder="Description"
          value={newReward.description}
          onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
          className={styles.taskInput}
        />
        <p className={styles.inputTip}>Description</p>
        <input
          type="number"
          placeholder="Cost"
          value={newReward.cost}
          onChange={(e) => setNewReward({ ...newReward, cost: parseInt(e.target.value) || 0 })}
          className={styles.taskInput}
        />
        <p className={styles.inputTip}>Cost</p>
        <div className={styles.taskButtons}>
          <button className="btn btn-success" onClick={() => addReward(newReward)}>Add</button>
          <button className="btn btn-danger" onClick={() => setIsAddRewardDialogOpen(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default RewardForm;
