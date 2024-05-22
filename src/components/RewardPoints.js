import React from 'react';
import styles from '@/styles/Reward.module.css';

const RewardPoints = ({ points }) => {
  return (
    <div className={styles.rewardPointsContainer}>
      <span className={styles.rewardPoints}>{points} points</span>
    </div>
  );
};

export default RewardPoints;
