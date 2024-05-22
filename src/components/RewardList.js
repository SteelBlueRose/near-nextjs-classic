import React from 'react';
import rewardlist_styles from '@/styles/Reward.module.css';
import rewards_container from '@/styles/TaskList.module.css';

const RewardList = ({ rewards, redeemReward, removeReward }) => {
  return (
    <div className={rewardlist_styles.rewardList}>
      {rewards.map((reward) => (
        <div key={reward.id} className={rewardlist_styles.reward}>
          <div className={rewardlist_styles.rewardLeft}>
            <div className={rewardlist_styles.rewardContent}>
              <h3 className={rewardlist_styles.truncatedText}>{reward.title}</h3>
              <p className={rewardlist_styles.truncatedText}>{reward.description}</p>
            </div>
          </div>
          <div className={rewardlist_styles.rewardRight}>
            <div className={rewards_container.rewardPointsContainer}>
              <div className={rewardlist_styles.rewardPoints}> {reward.cost}p </div>
            </div>
            <div className={rewardlist_styles.insideBtn}>
              <button className="btn btn-success" onClick={() => redeemReward(reward.id, reward.cost)}>Redeem</button>
            </div>
            <button className="btn btn-danger" onClick={() => removeReward(reward.id)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RewardList;
