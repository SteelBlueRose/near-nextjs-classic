import { useEffect, useState, useContext } from 'react';
import { NearContext } from '@/context';
import { TodoListContract } from '../config';

export const useNear = (accountId) => {
  const { wallet } = useContext(NearContext);
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [chartData, setChartData] = useState({ labels: [], values: [] });

  useEffect(() => {
    if (!wallet || !accountId) return;

    const fetchTasksAndRewards = async () => {
      const tasks = await wallet.viewMethod({
        contractId: TodoListContract,
        method: 'get_tasks',
        args: { account_id: accountId }
      });
      setTasks(tasks);

      const rewards = await wallet.viewMethod({
        contractId: TodoListContract,
        method: 'get_rewards',
        args: { account_id: accountId }
      });
      setRewards(rewards);

      const points = await wallet.viewMethod({
        contractId: TodoListContract,
        method: 'get_account_reward_points',
        args: { account_id: accountId }
      });
      setRewardPoints(points);

      fetchCompletedTasks('week'); // Default to weekly chart data
    };

    fetchTasksAndRewards();
  }, [wallet, accountId]);

  const addTask = async (taskData) => {
    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'add_task',
      args: taskData,
      gas: '300000000000000',
      deposit: '0'
    });
    const tasks = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_tasks',
      args: { account_id: accountId }
    });
    setTasks(tasks);
  };

  const removeTask = async (taskId) => {
    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'remove_task',
      args: { id: taskId },
      gas: '300000000000000',
      deposit: '0'
    });
    const tasks = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_tasks',
      args: { account_id: accountId }
    });
    setTasks(tasks);
  };

  const markComplete = async (taskId) => {
    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'mark_complete',
      args: { id: taskId },
      gas: '300000000000000',
      deposit: '0'
    });
    const tasks = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_tasks',
      args: { account_id: accountId }
    });
    setTasks(tasks);
  };

  const addReward = async (rewardData) => {
    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'add_reward',
      args: rewardData,
      gas: '300000000000000',
      deposit: '0'
    });
    const rewards = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_rewards',
      args: { account_id: accountId }
    });
    setRewards(rewards);
  };

  const removeReward = async (rewardId) => {
    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'remove_reward',
      args: { id: rewardId },
      gas: '300000000000000',
      deposit: '0'
    });
    const rewards = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_rewards',
      args: { account_id: accountId }
    });
    setRewards(rewards);
  };

  const redeemReward = async (rewardId) => {
    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'redeem_reward',
      args: { id: rewardId },
      gas: '300000000000000',
      deposit: '0'
    });
    const rewards = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_rewards',
      args: { account_id: accountId }
    });
    setRewards(rewards);
    const points = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_account_reward_points',
      args: { account_id: accountId }
    });
    setRewardPoints(points);
  };

  const fetchCompletedTasks = async (period) => {
    const completedTasks = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_completed_tasks_per_day',
      args: { account_id: accountId }
    });

    const today = new Date();
    const labels = [];
    const values = [];

    if (period === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const key = Math.floor(date.getTime() / 86400000).toString();
        labels.push(date.toLocaleDateString('en-GB', { weekday: 'short' }));
        values.push(completedTasks[key] || 0);
      }
    } else if (period === 'month') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const key = Math.floor(date.getTime() / 86400000).toString();
        labels.push(date.getDate());
        values.push(completedTasks[key] || 0);
      }
    }

    setChartData({ labels, values });
  };

  return {
    tasks,
    rewards,
    rewardPoints,
    chartData,
    addTask,
    removeTask,
    markComplete,
    addReward,
    removeReward,
    redeemReward,
    fetchCompletedTasks
  };
};
