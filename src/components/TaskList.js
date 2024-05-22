import React from 'react';
import tasklist_styles from '@/styles/TaskList.module.css';

const TaskList = ({ tasks, markComplete, handleEditClick, removeTask, showCompleted, truncateText, getPriorityColor, getPriorityClassName, formatEstimatedTime }) => {
  return (
    <div className={tasklist_styles.taskList}>
      {tasks.filter(task => showCompleted || !task.completed).map((task) => (
        <div key={task.id} className={`${tasklist_styles.task} ${task.completed ? tasklist_styles.completed : ''}`} onClick={() => handleEditClick(task)}>
          <div className={tasklist_styles.taskLeft}>
            <div className={tasklist_styles.checkboxContainer} onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => markComplete(task.id)}
              />
            </div>
            <div className={tasklist_styles.taskContent}>
              <h3 className={tasklist_styles.truncatedText}>{truncateText(task.title, 20)}</h3>
              <p className={tasklist_styles.truncatedText}>{truncateText(task.description, 50)}</p>
              <div className={tasklist_styles.taskMeta}>
                {task.deadline && <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>}
                {task.estimated_time && <span>Estimated Time: {formatEstimatedTime(task.estimated_time)}</span>}
              </div>
            </div>
          </div>
          <div className={tasklist_styles.taskRight}>
            <div className={tasklist_styles.priorityFlagContainer}>
              <div className={tasklist_styles.priorityFlag} style={{ backgroundColor: getPriorityColor(task.priority) }}>
                <div className={getPriorityClassName(task.priority)}>P</div>
              </div>
            </div>
            <div className={tasklist_styles.rewardPointsContainer}>
              <div className={tasklist_styles.rewardPoints}>
                {task.reward_points}p
              </div>
            </div>
            <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); removeTask(task.id); }}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
