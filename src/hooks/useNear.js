import { useEffect, useState, useContext } from 'react';
import { NearContext } from '@/context';
import { TodoListContract } from '../config';

export const useNear = (accountId) => {
  const { wallet } = useContext(NearContext);
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [chartData, setChartData] = useState({ labels: [], values: [] });
  const [workingHours, setWorkingHours] = useState(null);
  const [shouldShowSettingsForm, setShouldShowSettingsForm] = useState(false);

  useEffect(() => {
    if (!wallet || !accountId) return;

    const fetchData = async () => {
      try {

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

        const hours = await wallet.viewMethod({
          contractId: TodoListContract,
          method: 'get_working_hours',
          args: { account_id: accountId }
        });
        if (hours) {
          setWorkingHours(hours);
        } else {
          setShouldShowSettingsForm(true);
        }

        fetchCompletedTasks('week');
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
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

  const saveWorkingHours = async (workingHours) => {
    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'update_working_hours',
      args: { working_hours: workingHours },
      gas: '300000000000000',
      deposit: '0'
    });
    setWorkingHours(workingHours);
    setShouldShowSettingsForm(false);
  };

  return {
    tasks,
    rewards,
    rewardPoints,
    chartData,
    workingHours,
    addTask,
    removeTask,
    markComplete,
    addReward,
    removeReward,
    redeemReward,
    fetchCompletedTasks,
    saveWorkingHours,
    shouldShowSettingsForm
  };
};
