// components/OptimizeTasks.js

import React from 'react';

const OptimizeTasks = ({ tasks, setTasks }) => {
  const optimizeTasks = async () => {
    const response = await fetch('/api/optimize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tasks })
    });

    const result = await response.json();
    setTasks(result.result);  // Оновлення стану задач у TodoApp з отриманими задачами
  };

  return (
    <button className="btn btn-secondary" onClick={optimizeTasks}>Optimize Tasks</button>
  );
};

export default OptimizeTasks;
