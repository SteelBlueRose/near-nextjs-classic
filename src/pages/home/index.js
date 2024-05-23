import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { NearContext } from '@/context';
import { useNear } from '@/hooks/useNear';
import {
  markComplete,
  saveTask,
  addTask,
  removeTask,
  addReward,
  removeReward,
  redeemReward,
  truncateText,
  getPriorityColor,
  getPriorityClassName,
  formatEstimatedTime,
  sortTasks
} from '@/utils/taskHandlers';

import TaskList from '@/components/TaskList';
import RewardList from '@/components/RewardList';
import AddTaskForm from '@/components/AddTaskForm';
import EditTaskForm from '@/components/EditTaskForm';
import RewardForm from '@/components/RewardForm';
import SortDialog from '@/components/SortDialog';
import RewardPoints from '@/components/RewardPoints';
import CompletedTasksToday from '@/components/CompletedTasksToday';
import TaskChart from '@/components/TaskChart';
import PeriodDialog from '@/components/PeriodDialog';

import main_styles from '@/styles/Main.module.css';
import button_styles from '@/styles/Button.module.css';

const TodoApp = () => {
  const router = useRouter();
  const [currentTask, setCurrentTask] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddRewardDialogOpen, setIsAddRewardDialogOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);
  const [sortType, setSortType] = useState('time');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isPeriodDialogOpen, setIsPeriodDialogOpen] = useState(false);
  const [period, setPeriod] = useState('week');

  const { signedAccountId, wallet } = useContext(NearContext);
  const { tasks, setTasks, rewards, setRewards, rewardPoints, 
    chartData, setRewardPoints } = useNear(signedAccountId, period);

  useEffect(() => {
    if (!signedAccountId) {
      router.push('/');
    }
  }, [signedAccountId, router]);

  const sortedTasks = sortTasks(tasks, sortType, sortOrder);

  return (
    <main className={main_styles.main}>
      <div className={main_styles.container}>
        <div className={main_styles.leftBlock}>
          <div className={button_styles.buttonContainer}>
            <button className="btn btn-primary" onClick={() => setIsAddDialogOpen(true)}>Add a To Do</button>
            <button className="btn btn-primary" onClick={() => setIsAddRewardDialogOpen(true)}>Add a Reward</button>
            <button className="btn btn-secondary" onClick={() => setShowCompleted(!showCompleted)}>
              {showCompleted ? 'Hide Completed' : 'Show Completed'}
            </button>
            <button className="btn btn-secondary" onClick={() => setShowRewards(!showRewards)}>
              {showRewards ? 'Show Tasks' : 'Show Rewards'}
            </button>
            <button className="btn btn-secondary" onClick={() => setIsSortDialogOpen(true)}>Sort</button>
            <div className={main_styles.flexGrow}>
              <RewardPoints points={rewardPoints} />
            </div>
          </div>
          {!showRewards ? (
            <TaskList
              tasks={sortedTasks}
              markComplete={(taskId) => markComplete(wallet, taskId, setTasks)}
              handleEditClick={(task) => {
                if (!task.completed) {
                  setCurrentTask(task);
                  setIsEditDialogOpen(true);
                }
              }}
              removeTask={(taskId) => removeTask(wallet, taskId, setTasks)}
              showCompleted={showCompleted}
              truncateText={truncateText}
              getPriorityColor={getPriorityColor}
              getPriorityClassName={getPriorityClassName}
              formatEstimatedTime={formatEstimatedTime}
            />
          ) : (
            <RewardList
              rewards={rewards}
              redeemReward={(rewardId, cost) => redeemReward(wallet, rewardId, cost, rewardPoints, setRewardPoints, setRewards)}
              removeReward={(rewardId) => removeReward(wallet, rewardId, setRewards)}
            />
          )}
        </div>
        <div className={main_styles.rightBlock}>
          <div className={main_styles.buttonContainerRight}>
            <button className="btn btn-primary" onClick={() => setIsPeriodDialogOpen(true)}>Dashboard</button>
            <CompletedTasksToday />
          </div>
          <TaskChart key={period} data={chartData} />
        </div>
      </div>
      <AddTaskForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        addTask={(taskData) => addTask(wallet, taskData, setTasks, setIsAddDialogOpen)}
      />
      <EditTaskForm
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        currentTask={currentTask}
        saveTask={(taskData) => saveTask(wallet, taskData, setTasks, setIsEditDialogOpen)}
      />
      <RewardForm
        isAddRewardDialogOpen={isAddRewardDialogOpen}
        setIsAddRewardDialogOpen={setIsAddRewardDialogOpen}
        addReward={(reward) => addReward(wallet, reward, setRewards, setIsAddRewardDialogOpen)}
      />
      <SortDialog
        isSortDialogOpen={isSortDialogOpen}
        setIsSortDialogOpen={setIsSortDialogOpen}
        sortType={sortType}
        setSortType={setSortType}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      <PeriodDialog
        isOpen={isPeriodDialogOpen}
        onClose={() => setIsPeriodDialogOpen(false)}
        setPeriod={setPeriod}
      />
    </main>
  );
};

export default TodoApp;
