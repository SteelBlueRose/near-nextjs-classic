import { useState, useEffect, useContext } from 'react';
import { NearContext } from '@/context';
import { useRouter } from 'next/router';
import styles from '@/styles/app.module.css';
import { TodoListContract } from '../../config';
import TaskList from '@/components/TaskList';
import RewardList from '@/components/RewardList';
import AddTaskForm from '@/components/AddTaskForm';
import EditTaskForm from '@/components/EditTaskForm';
import RewardForm from '@/components/RewardForm';
import SortDialog from '@/components/SortDialog';
import RewardPoints from '@/components/RewardPoints';

const CONTRACT = TodoListContract;

export default function TodoApp() {
  const { signedAccountId, wallet } = useContext(NearContext);
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddRewardDialogOpen, setIsAddRewardDialogOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);
  const [sortType, setSortType] = useState('time');
  const [sortOrder, setSortOrder] = useState('asc');
  const [rewardPoints, setRewardPoints] = useState(0);

  useEffect(() => {
    if (!signedAccountId) {
      router.push('/');
      return;
    }
    setLoggedIn(!!signedAccountId);
  }, [signedAccountId, router]);

  useEffect(() => {
    if (!wallet || !signedAccountId) return;

    const fetchTasksAndPoints = async () => {
      const tasks = await wallet.viewMethod({ contractId: CONTRACT, method: 'get_tasks' });
      setTasks(tasks);

      const points = await wallet.viewMethod({
        contractId: CONTRACT,
        method: 'get_account_reward_points',
        args: { account_id: signedAccountId }
      });
      setRewardPoints(points);

      const rewards = await wallet.viewMethod({
        contractId: CONTRACT,
        method: 'get_rewards',
      });
      setRewards(rewards);
    };

    fetchTasksAndPoints();

    const handleRouteChange = () => {
      fetchTasksAndPoints();
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [wallet, router.events, signedAccountId]);

  const markComplete = async (taskId) => {
    try {
      await wallet.callMethod({
        contractId: CONTRACT,
        method: 'mark_complete',
        args: { id: taskId },
      });

      const updatedTasks = await wallet.viewMethod({ contractId: CONTRACT, method: 'get_tasks' });
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to sign and send transaction', error);
    }
  };

  const handleEditClick = (task) => {
    if (!task.completed) {
      setCurrentTask(task);
      setIsEditDialogOpen(true);
    }
  };

  const saveTask = async (taskData) => {
    const { id, title, description, priority, deadline, estimated_time, reward_points } = taskData;
    await wallet.callMethod({
      contractId: CONTRACT,
      method: 'update_task',
      args: {
        id,
        title,
        description,
        priority,
        deadline,
        estimated_time,
        reward_points,
      },
    });
    const tasks = await wallet.viewMethod({ contractId: CONTRACT, method: 'get_tasks' });
    setTasks(tasks);
    setIsEditDialogOpen(false);
  };

  const addTask = async (taskData) => {
    const { title, description, priority, deadline, estimated_time, reward_points } = taskData;
    setIsAddDialogOpen(false);
    await wallet.callMethod({
      contractId: CONTRACT,
      method: 'add_task',
      args: {
        title,
        description,
        priority,
        deadline,
        estimated_time,
        reward_points,
      },
    });
    const tasks = await wallet.viewMethod({ contractId: CONTRACT, method: 'get_tasks' });
    setTasks(tasks);
  };

  const addReward = async (reward) => {
    await wallet.callMethod({
      contractId: CONTRACT,
      method: 'add_reward',
      args: reward,
    });
    const rewards = await wallet.viewMethod({ contractId: CONTRACT, method: 'get_rewards' });
    setRewards(rewards);
    setIsAddRewardDialogOpen(false);
  };

  const removeTask = async (taskId) => {
    await wallet.callMethod({
      contractId: CONTRACT,
      method: 'remove_task',
      args: { id: taskId },
    });
    const tasks = await wallet.viewMethod({ contractId: CONTRACT, method: 'get_tasks' });
    setTasks(tasks);
  };

  const removeReward = async (rewardId) => {
    await wallet.callMethod({
      contractId: CONTRACT,
      method: 'remove_reward',
      args: { id: rewardId },
    });
    const rewards = await wallet.viewMethod({ contractId: CONTRACT, method: 'get_rewards' });
    setRewards(rewards);
  };

  const redeemReward = async (rewardId, cost) => {
    if (rewardPoints < cost) {
      return;
    }

    const success = await wallet.callMethod({
      contractId: CONTRACT,
      method: 'redeem_reward',
      args: { id: rewardId },
    });

    if (success) {
      const points = await wallet.viewMethod({
        contractId: CONTRACT,
        method: 'get_account_reward_points',
        args: { account_id: signedAccountId }
      });
      setRewardPoints(points);

      const rewards = await wallet.viewMethod({ contractId: CONTRACT, method: 'get_rewards' });
      setRewards(rewards);

      const rewardElement = document.getElementById(`reward-${rewardId}`);
      if (rewardElement) {
        rewardElement.classList.add('highlight');
        setTimeout(() => rewardElement.classList.remove('highlight'), 2000);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1: return '#00BFFF'; // blue
      case 2: return '#FFD700'; // yellow
      case 3: return '#FF4500'; // red
      default: return '#A9A9A9'; // grey
    }
  };

  const getPriorityClassName = (priority) => {
    switch (priority) {
      case 1: return `${styles.priorityFlag} ${styles.blue}`;
      case 2: return `${styles.priorityFlag} ${styles.yellow}`;
      case 3: return `${styles.priorityFlag} ${styles.red}`;
      default: return `${styles.priorityFlag} ${styles.grey}`;
    }
  };

  const formatEstimatedTime = (time) => {
    if (isNaN(time) || time === null || time === 0) return '';
    return `${time.toFixed(2)} hours`;
  };

  const sortedTasks = tasks.slice().sort((a, b) => {
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

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <div className={styles.buttonContainer}>
          <button className="btn btn-primary" onClick={() => setIsAddDialogOpen(true)}>Add a To Do</button>
          <button className="btn btn-primary" onClick={() => setIsAddRewardDialogOpen(true)}>Add a Reward</button>
          <button className="btn btn-secondary" onClick={() => setShowCompleted(!showCompleted)}>
            {showCompleted ? 'Hide Completed' : 'Show Completed'}
          </button>
          <button className="btn btn-secondary" onClick={() => setShowRewards(!showRewards)}>
            {showRewards ? 'Hide Rewards' : 'Show Rewards'}
          </button>
          <button className="btn btn-secondary" onClick={() => setIsSortDialogOpen(true)}>Sort</button>
          <div className={styles.flexGrow}>
            <RewardPoints points={rewardPoints} />
          </div>
        </div>
        <TaskList
          tasks={sortedTasks}
          markComplete={markComplete}
          handleEditClick={handleEditClick}
          removeTask={removeTask}
          showCompleted={showCompleted}
          truncateText={truncateText}
          getPriorityColor={getPriorityColor}
          getPriorityClassName={getPriorityClassName}
          formatEstimatedTime={formatEstimatedTime}
        />
        {showRewards && (
          <RewardList
            rewards={rewards}
            redeemReward={redeemReward}
            removeReward={removeReward}
          />
        )}
      </div>
      <AddTaskForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        addTask={addTask}
      />
      <EditTaskForm
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        currentTask={currentTask}
        saveTask={saveTask}
      />
      <RewardForm
        isAddRewardDialogOpen={isAddRewardDialogOpen}
        setIsAddRewardDialogOpen={setIsAddRewardDialogOpen}
        addReward={addReward}
      />
      <SortDialog
        isSortDialogOpen={isSortDialogOpen}
        setIsSortDialogOpen={setIsSortDialogOpen}
        sortType={sortType}
        setSortType={setSortType}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    </main>
  );
}
