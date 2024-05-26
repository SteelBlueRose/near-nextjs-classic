export const getPriorityColor = (priority) => {
    switch (priority) {
      case 1: return '#00BFFF'; // blue
      case 2: return '#FFD700'; // yellow
      case 3: return '#FF4500'; // red
      default: return '#A9A9A9'; // grey
    }
  };
  
  export const getPriorityClassName = (priority) => {
    switch (priority) {
      case 1: return 'priorityBlue';
      case 2: return 'priorityYellow';
      case 3: return 'priorityRed';
      default: return 'priorityGrey';
    }
  };

export const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
};

export const formatEstimatedTime = (time) => {
    if (isNaN(time) || time === null || time === 0) return '';
    return `${time.toFixed(2)} hours`;
  };

export const sortTasks = (tasks, sortType, sortOrder) => {
    return tasks.slice().sort((a, b) => {
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
};