import { useState, useEffect, useContext } from 'react';
import { NearContext } from '@/context';
import { TodoListContract } from '../config';

import completedtasks_styles from '@/styles/CompletedTasksToday.module.css';

const CONTRACT = TodoListContract;

export default function CompletedTasksToday() {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [completedTasksToday, setCompletedTasksToday] = useState(0);

  useEffect(() => {
    if (!wallet || !signedAccountId) return;

    const fetchCompletedTasksToday = async () => {
      const completedTasks = await wallet.viewMethod({
        contractId: CONTRACT,
        method: 'get_completed_tasks_per_day',
        args: { account_id: signedAccountId }
      });

      const today = Math.floor(Date.now() / 86400000).toString();
      setCompletedTasksToday(completedTasks[today] || 0);
    };

    fetchCompletedTasksToday();
  }, [wallet, signedAccountId]);

  return (
    <div className={completedtasks_styles.completedTasksTodayContainer}>
      <p>Completed today: {completedTasksToday}</p>
    </div>
  );
}
