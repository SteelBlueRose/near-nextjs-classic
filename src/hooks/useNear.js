// hooks/useNear.js
import { useEffect, useState, useContext, useRef } from 'react';
import { NearContext } from '@/context';
import { TodoListContract } from '../config';
import { scheduleTasks, sortTasksByPriority } from '@/utils/greedy_scheduler';

export const useNear = (accountId, period) => {
  const { wallet } = useContext(NearContext);
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [chartData, setChartData] = useState({ labels: [], values: [] });
  const [workingHours, setWorkingHours] = useState(null);
  const [shouldShowSettingsForm, setShouldShowSettingsForm] = useState(false);
  const [breaks, setBreaks] = useState({ regular_breaks: [], one_time_breaks: [] });
  const isDataFetchedRef = useRef(false);

  useEffect(() => {
    if (!wallet || !accountId || isDataFetchedRef.current) return;

    const fetchData = async () => {
      try {
        const tasks = await wallet.viewMethod({
          contractId: TodoListContract,
          method: 'get_tasks',
          args: { account_id: accountId },
        });
        setTasks(tasks);

        const rewards = await wallet.viewMethod({
          contractId: TodoListContract,
          method: 'get_rewards',
          args: { account_id: accountId },
        });
        setRewards(rewards);

        const points = await wallet.viewMethod({
          contractId: TodoListContract,
          method: 'get_account_reward_points',
          args: { account_id: accountId },
        });
        setRewardPoints(points);

        const hours = await wallet.viewMethod({
          contractId: TodoListContract,
          method: 'get_working_hours',
          args: { account_id: accountId },
        });
        if (hours) {
          setWorkingHours(hours);
        } else {
          setShouldShowSettingsForm(true);
        }

        fetchCompletedTasks(period);
        fetchBreaks(accountId);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
    isDataFetchedRef.current = true;
  }, [wallet, accountId]);

  useEffect(() => {
    if (wallet && accountId) {
      fetchCompletedTasks(period);
    }
  }, [period]);

  const fetchCompletedTasks = async (period) => {
    const completedTasks = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_completed_tasks_per_day',
      args: { account_id: accountId },
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

  const fetchBreaks = async (accountId) => {
    const breaks = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_breaks',
      args: { account_id: accountId },
    });
    setBreaks(breaks);
  };

  const callScheduler = async () => {
    const tasks = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_tasks',
      args: { account_id: accountId },
    });

    const workingHours = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_working_hours',
      args: { account_id: accountId },
    });

    const breaks = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_breaks',
      args: { account_id: accountId },
    });

    const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const workHours = [workingHours.start_time * 60, workingHours.end_time * 60]; // Конвертувати в хвилини
    const sortedTasks = sortTasksByPriority(tasks);
    const scheduledTasks = sortedTasks.map(task => {
      const dayIndex = weekDays.indexOf(task.day.toLowerCase());
      return { ...task, dayIndex, duration: task.estimated_time * 60 };
    });
    const finalSchedule = scheduleTasks(scheduledTasks, workHours, breaks);

    setTasks(finalSchedule);

    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'update_time_slots',
      args: { time_slots: finalSchedule },
      gas: '300000000000000',
      deposit: '0',
    });
  };

  const addTask = async (taskData) => {
    const newTask = { ...taskData, id: tasks.length + 1 };
    setTasks([...tasks, newTask]);
    await callScheduler();
  };

  const updateTask = async (taskData) => {
    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'update_task',
      args: taskData,
      gas: '300000000000000',
      deposit: '0',
    });
    await callScheduler();
  };

  const removeTask = async (taskId) => {
    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'remove_task',
      args: { id: taskId },
      gas: '300000000000000',
      deposit: '0',
    });
    await callScheduler();
  };

  const markComplete = async (taskId) => {
    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'mark_complete',
      args: { id: taskId },
      gas: '300000000000000',
      deposit: '0',
    });
    await callScheduler();
  };

  const addReward = async (rewardData) => {
    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'add_reward',
      args: rewardData,
      gas: '300000000000000',
      deposit: '0',
    });

    const rewards = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_rewards',
      args: { account_id: accountId },
    });
    setRewards(rewards);
  };

  const removeReward = async (rewardId) => {
    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'remove_reward',
      args: { id: rewardId },
      gas: '300000000000000',
      deposit: '0',
    });

    const rewards = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_rewards',
      args: { account_id: accountId },
    });
    setRewards(rewards);
  };

  const redeemReward = async (rewardId) => {
    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'redeem_reward',
      args: { id: rewardId },
      gas: '300000000000000',
      deposit: '0',
    });

    const rewards = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_rewards',
      args: { account_id: accountId },
    });
    setRewards(rewards);
    const points = await wallet.viewMethod({
      contractId: TodoListContract,
      method: 'get_account_reward_points',
      args: { account_id: accountId },
    });
    setRewardPoints(points);
  };

  const saveWorkingHours = async (workingHours) => {
    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'update_working_hours',
      args: { working_hours: workingHours },
      gas: '300000000000000',
      deposit: '0',
    });
    setWorkingHours(workingHours);
    setShouldShowSettingsForm(false);
    await callScheduler();
  };

  const addBreak = async (startTime, endTime, isRegular, date) => {
    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'add_break',
      args: { start_time: startTime, end_time: endTime, is_regular: isRegular, date },
      gas: '300000000000000',
      deposit: '0',
    });
    fetchBreaks(accountId);
    await callScheduler();
  };

  const updateBreak = async (oldStartTime, oldEndTime, newStartTime, newEndTime, isRegular, newDate) => {
    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'update_break',
      args: { old_start_time: oldStartTime, old_end_time: oldEndTime, new_start_time: newStartTime, new_end_time: newEndTime, is_regular: isRegular, new_date: newDate },
      gas: '300000000000000',
      deposit: '0',
    });
    fetchBreaks(accountId);
    await callScheduler();
  };

  const removeBreak = async (startTime, endTime, isRegular, date) => {
    await wallet.callMethod({
      contractId: TodoListContract,
      method: 'remove_break',
      args: { start_time: startTime, end_time: endTime, is_regular: isRegular, date },
      gas: '300000000000000',
      deposit: '0',
    });
    fetchBreaks(accountId);
    await callScheduler();
  };

  return {
    tasks,
    rewards,
    rewardPoints,
    chartData,
    workingHours,
    breaks,
    addTask,
    updateTask,
    removeTask,
    markComplete,
    addReward,
    removeReward,
    redeemReward,
    fetchCompletedTasks,
    fetchBreaks,
    saveWorkingHours,
    addBreak,
    updateBreak,
    removeBreak,
    shouldShowSettingsForm,
  };
};
