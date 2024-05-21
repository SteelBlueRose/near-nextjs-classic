import React from 'react';
import styles from '@/styles/app.module.css';

const RewardList = ({ rewards, redeemReward, removeReward }) => {
  return (
    <div className={styles.rewardList}>
      {rewards.map((reward) => (
        <div key={reward.id} id={`reward-${reward.id}`} className={styles.reward}>
          <div className={styles.rewardContent}>
            <h3>{reward.title}</h3>
            <p>{reward.description}</p>
            <div className={styles.rewardCost}>{reward.cost} points</div>
          </div>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => redeemReward(reward.id, reward.cost)}>Redeem</button>
          <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => removeReward(reward.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default RewardList;
