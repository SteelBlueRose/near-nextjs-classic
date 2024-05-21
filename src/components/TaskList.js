import React from 'react';
import styles from '@/styles/app.module.css';

const TaskList = ({ tasks, markComplete, handleEditClick, removeTask, showCompleted, truncateText, getPriorityColor, getPriorityClassName, formatEstimatedTime }) => {
  return (
    <div className={styles.taskList}>
      {tasks.filter(task => showCompleted || !task.completed).map((task) => (
        <div key={task.id} className={`${styles.task} ${task.completed ? styles.completed : ''}`} onClick={() => handleEditClick(task)}>
          <div className={styles.checkboxContainer} onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => markComplete(task.id)}
            />
          </div>
          <div className={styles.taskContent}>
            <h3 className={styles.truncatedText}>{truncateText(task.title, 20)}</h3>
            <p className={styles.truncatedText}>{truncateText(task.description, 50)}</p>
            <div className={styles.taskMeta}>
              {task.deadline && <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>}
              {task.estimated_time && <span>Estimated Time: {formatEstimatedTime(task.estimated_time)}</span>}
            </div>
          </div>
          <div className={styles.priorityFlagContainer}>
            <div className={styles.priorityFlag} style={{ backgroundColor: getPriorityColor(task.priority) }}>
              <div className={getPriorityClassName(task.priority)}>P</div>
            </div>
          </div>
          <div className={styles.rewardPointsContainer}>
            <div className={styles.rewardPoints}>
              {task.reward_points}p
            </div>
          </div>
          <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); removeTask(task.id); }}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
