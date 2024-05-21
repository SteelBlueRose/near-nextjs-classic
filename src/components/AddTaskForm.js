import React, { useState } from 'react';
import styles from '@/styles/app.module.css';

const AddTaskForm = ({ isOpen, onClose, addTask }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 0,
    deadline: '',
    estimatedTime: 0,
    rewardPoints: 0,
  });

  const handleSave = () => {
    const formattedTask = {
      title: taskData.title,
      description: taskData.description,
      priority: parseInt(taskData.priority),
      deadline: taskData.deadline ? new Date(taskData.deadline).getTime() : null,
      estimated_time: taskData.estimatedTime ? parseFloat(taskData.estimatedTime) : null,
      reward_points: parseInt(taskData.rewardPoints) || 0,
    };

    addTask(formattedTask);
    onClose();
  };

  return isOpen && (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialog}>
        <h2>Add Task</h2>
        <input
          type="text"
          placeholder="Title"
          value={taskData.title}
          onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
          className={styles.taskInput}
        />
        <p className={styles.inputTip}>Title</p>
        <input
          type="text"
          placeholder="Description"
          value={taskData.description}
          onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
          className={styles.taskInput}
        />
        <p className={styles.inputTip}>Description</p>
        <select value={taskData.priority} onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })} className={styles.taskInput}>
          <option value="0">Low (Grey)</option>
          <option value="1">Medium (Blue)</option>
          <option value="2">High (Yellow)</option>
          <option value="3">Critical (Red)</option>
        </select>
        <p className={styles.inputTip}>Priority</p>
        <input
          type="date"
          placeholder="Deadline"
          value={taskData.deadline}
          onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })}
          className={styles.taskInput}
        />
        <p className={styles.inputTip}>Deadline</p>
        <input
          type="number"
          step="0.1"
          placeholder="Estimated Time (hours)"
          value={taskData.estimatedTime}
          onChange={(e) => setTaskData({ ...taskData, estimatedTime: e.target.value })}
          className={styles.taskInput}
        />
        <p className={styles.inputTip}>Estimated Time</p>
        <input
          type="number"
          placeholder="Reward Points"
          value={taskData.rewardPoints}
          onChange={(e) => setTaskData({ ...taskData, rewardPoints: parseInt(e.target.value) || 0 })}
          className={styles.taskInput}
        />
        <p className={styles.inputTip}>Reward Points</p>
        <div className={styles.taskButtons}>
          <button className="btn btn-success" onClick={handleSave}>Add</button>
          <button className="btn btn-danger" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskForm;
