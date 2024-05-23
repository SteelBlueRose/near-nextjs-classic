import { useEffect, useState, useContext } from 'react';
import { NearContext } from '@/context';
import { TodoListContract } from '../config';
import { useRouter } from 'next/router';

export const useNear = (signedAccountId, period) => {
  const { wallet } = useContext(NearContext);
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [chartData, setChartData] = useState({ labels: [], values: [] });
  const router = useRouter();

  useEffect(() => {
    if (!wallet || !signedAccountId) return;

    const fetchTasksAndPoints = async () => {
      const tasks = await wallet.viewMethod({ contractId: TodoListContract, method: 'get_tasks' });
      setTasks(tasks);

      const points = await wallet.viewMethod({
        contractId: TodoListContract,
        method: 'get_account_reward_points',
        args: { account_id: signedAccountId }
      });
      setRewardPoints(points);

      const rewards = await wallet.viewMethod({
        contractId: TodoListContract,
        method: 'get_rewards',
      });
      setRewards(rewards);

      fetchCompletedTasks(period);
    };

    fetchTasksAndPoints();

    const handleRouteChange = () => {
      fetchTasksAndPoints();
    };

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [wallet, signedAccountId, period]);

  const fetchCompletedTasks = async (period) => {
    const completedTasks = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_completed_tasks_per_day',
      args: { account_id: signedAccountId }
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

  return { tasks, rewards, rewardPoints, chartData, fetchCompletedTasks };
};
