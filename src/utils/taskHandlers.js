import { TodoListContract } from '../config';

export const markComplete = async (wallet, taskId, setTasks) => {
  try {
    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'mark_complete',
      args: { id: taskId },
    });

    const updatedTasks = await wallet.viewMethod({ contractId: TodoListContract, method: 'get_tasks' });
    setTasks(updatedTasks);
  } catch (error) {
    console.error('Failed to sign and send transaction', error);
  }
};

export const saveTask = async (wallet, taskData, setTasks, setIsEditDialogOpen) => {
  const { id, title, description, priority, deadline, estimated_time, 
    reward_points, preferred_start_time, preferred_end_time } = taskData;
  await wallet.callMethod({
    contractId: TodoListContract,
    method: 'update_task',
    args: {
      id,
      title,
      description,
      priority,
      deadline,
      estimated_time,
      reward_points,
      preferred_start_time,
      preferred_end_time,
    },
  });
  const tasks = await wallet.viewMethod({ contractId: TodoListContract, method: 'get_tasks' });
  setTasks(tasks);
  setIsEditDialogOpen(false);
};

export const addTask = async (wallet, taskData, setTasks, setIsAddDialogOpen) => {
  const { title, description, priority, deadline, estimated_time, 
    reward_points, preferred_start_time, preferred_end_time } = taskData;
  setIsAddDialogOpen(false);
  await wallet.callMethod({
    contractId: TodoListContract,
    method: 'add_task',
    args: {
      title,
      description,
      priority,
      deadline,
      estimated_time,
      reward_points,
      preferred_start_time,
      preferred_end_time
    },
  });
  const tasks = await wallet.viewMethod({ contractId: TodoListContract, method: 'get_tasks' });
  setTasks(tasks);
};

export const removeTask = async (wallet, taskId, setTasks) => {
  await wallet.callMethod({
    contractId: TodoListContract,
    method: 'remove_task',
    args: { id: taskId },
  });
  const tasks = await wallet.viewMethod({ contractId: TodoListContract, method: 'get_tasks' });
  setTasks(tasks);
};

export const addReward = async (wallet, reward, setRewards, setIsAddRewardDialogOpen) => {
  await wallet.callMethod({
    contractId: TodoListContract,
    method: 'add_reward',
    args: reward,
  });
  const rewards = await wallet.viewMethod({ contractId: TodoListContract, method: 'get_rewards' });
  setRewards(rewards);
  setIsAddRewardDialogOpen(false);
};

export const removeReward = async (wallet, rewardId, setRewards) => {
  await wallet.callMethod({
    contractId: TodoListContract,
    method: 'remove_reward',
    args: { id: rewardId },
  });
  const rewards = await wallet.viewMethod({ contractId: TodoListContract, method: 'get_rewards' });
  setRewards(rewards);
};

export const redeemReward = async (wallet, rewardId, cost, rewardPoints, setRewardPoints, setRewards) => {
  if (rewardPoints < cost) {
    return;
  }

  const success = await wallet.callMethod({
    contractId: TodoListContract,
    method: 'redeem_reward',
    args: { id: rewardId },
  });

  if (success) {
    const points = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_account_reward_points',
      args: { account_id: signedAccountId }
    });
    setRewardPoints(points);

    const rewards = await wallet.viewMethod({ contractId: TodoListContract, method: 'get_rewards' });
    setRewards(rewards);

    const rewardElement = document.getElementById(`reward-${rewardId}`);
    if (rewardElement) {
      rewardElement.classList.add('highlight');
      setTimeout(() => rewardElement.classList.remove('highlight'), 2000);
    }
  }
};

export const getPriorityColor = (priority) => {
    switch (priority) {
      case 1: return '#00BFFF'; // blue
      case 2: return '#FFD700'; // yellow
      case 3: return '#FF4500'; // red
      default: return '#A9A9A9'; // grey
    }
  };
  
  export const getPriorityClassName = (priority) => {
    switch (priority) {
      case 1: return 'priorityBlue';
      case 2: return 'priorityYellow';
      case 3: return 'priorityRed';
      default: return 'priorityGrey';
    }
  };

export const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
};

export const formatEstimatedTime = (time) => {
    if (isNaN(time) || time === null || time === 0) return '';
    return `${time.toFixed(2)} hours`;
  };

export const sortTasks = (tasks, sortType, sortOrder) => {
    return tasks.slice().sort((a, b) => {
        if (a.completed !== b.completed) {
        return a.completed - b.completed;
        }

        let compareA, compareB;
        if (sortType === 'time') {
        compareA = a.estimated_time || 0;
        compareB = b.estimated_time || 0;
        } else if (sortType === 'deadline') {
        compareA = a.deadline || 0;
        compareB = b.deadline || 0;
        } else if (sortType === 'reward_points') {
        compareA = a.reward_points || 0;
        compareB = b.reward_points || 0;
        }

        if (sortOrder === 'asc') {
        return compareA - compareB;
        } else {
        return compareB - compareA;
        }
    });
};