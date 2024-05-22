import React from 'react';
import reward_styles from '@/styles/Reward.module.css';
import button_styles from '@/styles/Button.module.css';

const RewardList = ({ rewards, redeemReward, removeReward }) => {
  return (
    <div className={reward_styles.rewardList}>
      {rewards.map((reward) => (
        <div key={reward.id} id={`reward-${reward.id}`} className={reward_styles.reward}>
          <div className={reward_styles.rewardContent}>
            <h3>{reward.title}</h3>
            <p>{reward.description}</p>
            <div className={reward_styles.rewardCost}>{reward.cost} points</div>
          </div>
          <button className={`${button_styles.btn} ${button_styles.btnPrimary}`} onClick={() => redeemReward(reward.id, reward.cost)}>Redeem</button>
          <button className={`${button_styles.btn} ${button_styles.btnDanger}`} onClick={() => removeReward(reward.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default RewardList;
