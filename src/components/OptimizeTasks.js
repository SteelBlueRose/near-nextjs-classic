import React from 'react';

const OptimizeTasks = ({ tasks, setOptimizedTasks }) => {
  const optimizeTasks = async () => {
    const response = await fetch('/api/optimize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tasks })
    });

    const result = await response.json();
    setOptimizedTasks(result.result);
  };

  return (
    <button onClick={optimizeTasks} className="btn btn-primary">Optimize Tasks</button>
  );
};

export default OptimizeTasks;
