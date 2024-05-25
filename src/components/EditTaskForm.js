import React, { useState, useEffect } from 'react';
import styles from '@/styles/Dialog.module.css';

const EditTaskForm = ({ isOpen, onClose, currentTask, saveTask, workingHours }) => {
  const [taskData, setTaskData] = useState({
    id: null,
    title: '',
    description: '',
    priority: 0,
    deadline: '',
    estimated_time: 0,
    reward_points: 0,
    preferred_start_time: '',
    preferred_end_time: '',
  });

  useEffect(() => {
    if (currentTask) {
      setTaskData({
        ...currentTask,
        deadline: currentTask.deadline ? new Date(currentTask.deadline).toISOString().substring(0, 10) : '',
        preferred_start_time: currentTask.preferred_start_time ? convertFloatToTime(currentTask.preferred_start_time) : '',
        preferred_end_time: currentTask.preferred_end_time ? convertFloatToTime(currentTask.preferred_end_time) : '',
      });
    }
  }, [currentTask]);

  const validatePreferredTimes = () => {
    const startTime = parseFloat(taskData.preferred_start_time.replace(':', '.'));
    const endTime = parseFloat(taskData.preferred_end_time.replace(':', '.'));

    if (startTime >= endTime) {
      alert('Preferred start time must be less than the preferred end time.');
      return false;
    }

    const dayOfWeek = new Date(taskData.deadline).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const userWorkingHours = workingHours[dayOfWeek];

    if (!userWorkingHours) {
      alert(`No working hours set for ${dayOfWeek}.`);
      return false;
    }

    if (startTime < userWorkingHours.start_time || endTime > userWorkingHours.end_time) {
      alert('Preferred times must be within the working hours.');
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validatePreferredTimes()) return;

    const formattedTask = {
      ...taskData,
      priority: parseInt(taskData.priority),
      deadline: taskData.deadline ? new Date(taskData.deadline).getTime() : null,
      estimated_time: taskData.estimated_time ? parseFloat(taskData.estimated_time) : null,
      reward_points: parseInt(taskData.reward_points),
      preferred_start_time: taskData.preferred_start_time ? parseFloat(taskData.preferred_start_time.replace(':', '.')) : null,
      preferred_end_time: taskData.preferred_end_time ? parseFloat(taskData.preferred_end_time.replace(':', '.')) : null,
    };

    saveTask(formattedTask);
    onClose();
  };

  const convertFloatToTime = (timeFloat) => {
    const hours = Math.floor(timeFloat);
    const minutes = Math.round((timeFloat - hours) * 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  return isOpen && (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialog}>
        <h2>Edit Task</h2>
        <input
          type="text"
          placeholder="Title"
          value={taskData.title}
          onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
          className={styles.taskInput}
          required
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
          required
        />
        <p className={styles.inputTip}>Deadline</p>
        <input
          type="number"
          step="0.1"
          placeholder="Estimated Time (hours)"
          value={taskData.estimated_time}
          onChange={(e) => setTaskData({ ...taskData, estimated_time: e.target.value })}
          className={styles.taskInput}
          required
        />
        <p className={styles.inputTip}>Estimated Time in hours</p>
        <input
          type="number"
          placeholder="Reward Points"
          value={taskData.reward_points}
          onChange={(e) => setTaskData({ ...taskData, reward_points: parseInt(e.target.value) })}
          className={styles.taskInput}
          required
        />
        <p className={styles.inputTip}>Reward Points</p>
        <div className={styles.hoursRow}>
          <div>
            <input
              type="time"
              value={taskData.preferred_start_time}
              onChange={(e) => setTaskData({ ...taskData, preferred_start_time: e.target.value })}
              required
            />
            <p className={`${styles.inputTip} ${styles.inputTipNoTopMargin}`}>Preferred start time slot</p>
          </div>
          <div>
            <input
              type="time"
              value={taskData.preferred_end_time}
              onChange={(e) => setTaskData({ ...taskData, preferred_end_time: e.target.value })}
              required
            />
            <p className={`${styles.inputTip} ${styles.inputTipNoTopMargin}`}>Preferred end time slot</p>
          </div>
        </div>

        <div className={styles.taskButtons}>
          <button className="btn btn-success" onClick={handleSave}>Save</button>
          <button className="btn btn-danger" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskForm;
