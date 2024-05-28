/**
 * Find available time slots within working hours, excluding break times.
 *
 * @param {Array} workHours - Array with two elements, start and end time in minutes from start of the day.
 * @param {Array} breaks - Array of break objects with start_time and end_time properties.
 * @returns {Array} Array of available time slots.
 */
export const findAvailableSlots = (workHours, breaks) => {
    let slots = [];
    let currentTime = workHours[0];

    if (breaks.length === 0) {
        slots.push([currentTime, workHours[1]]);
    } else {
        breaks.forEach(break_ => {
            const startBreak = break_.start_time;
            const endBreak = break_.end_time;
            if (currentTime < startBreak) {
                slots.push([currentTime, startBreak]);
            }
            currentTime = endBreak;
        });

        if (currentTime < workHours[1]) {
            slots.push([currentTime, workHours[1]]);
        }
    }

    return slots;
};

/**
 * Normalize task properties to a scale from 0 to 1.
 *
 * @param {Array} tasks - Array of task objects.
 * @returns {Array} Array of tasks with normalized properties.
 */
export const normalizeTasks = (tasks) => {
    const maxPriority = Math.max(...tasks.map(task => task.priority));
    const maxDeadline = Math.max(...tasks.map(task => task.deadline));
    const maxDuration = Math.max(...tasks.map(task => task.duration));
    const maxRewardPoints = Math.max(...tasks.map(task => task.rewardPoints));

    return tasks.map(task => ({
        ...task,
        normPriority: task.priority / maxPriority,
        normDeadline: task.deadline / maxDeadline,
        normDuration: task.duration / maxDuration,
        normRewardPoints: task.rewardPoints / maxRewardPoints
    }));
};

/**
 * Sort tasks by priority based on normalized properties.
 *
 * @param {Array} tasks - Array of task objects.
 * @returns {Array} Array of sorted task objects by priority.
 */
export const sortTasksByPriority = (tasks) => {
    const normalizedTasks = normalizeTasks(tasks);
    const sortedIndices = normalizedTasks.map((task, index) => ({
        index,
        priority: 0.4 * task.normPriority + 0.3 * task.normRewardPoints + 0.2 * (1 / task.normDeadline) + 0.1 * (1 / task.normDuration)
    }))
    .sort((a, b) => b.priority - a.priority)
    .map(task => task.index);

    return sortedIndices.map(index => tasks[index]);
};

/**
 * Schedule tasks within available time slots.
 *
 * @param {Array} tasks - Array of sorted task objects.
 * @param {Array} workHours - Array with two elements, start and end time in minutes from start of the day.
 * @param {Array} breaks - Array of break objects with start_time and end_time properties.
 * @returns {Array} Array of scheduled task objects with start and end times.
 */
export const scheduleTasks = (tasks, workHours, breaks) => {
    const slots = findAvailableSlots(workHours, breaks);
    const schedule = [];
    
    tasks.forEach(task => {
        const { id, duration } = task;
        for (let i = 0; i < slots.length; i++) {
            const [slotStart, slotEnd] = slots[i];
            if (slotEnd - slotStart >= duration) {
                schedule.push({ ...task, startTime: slotStart, endTime: slotStart + duration });
                slots.splice(i, 1, [slotStart + duration, slotEnd]);
                break;
            }
        }
    });

    schedule.sort((a, b) => a.startTime - b.startTime);
    return schedule;
};
