import React from 'react';
import moment from 'moment';
import styles from '@/styles/TaskSchedule.module.css';

const TaskSchedule = ({ tasks, daysOfWeek, hours, workingHours, breaks }) => {
    const isWorkingHour = (day, hour) => {
        if (!workingHours || !workingHours[day.toLowerCase()]) return false;
        const { start_time, end_time } = workingHours[day.toLowerCase()];
        return hour >= start_time && hour < end_time;
    };

    const isBreakHour = (day, hour, halfHour) => {
        if (!breaks) return false;
        const regularBreaks = breaks.regular_breaks || [];
        const oneTimeBreaks = breaks.one_time_breaks || [];

        const timeToFloat = (hour, halfHour) => hour + (halfHour ? 0.5 : 0);

        // Check regular breaks
        for (const break_ of regularBreaks) {
            if (timeToFloat(hour, halfHour) >= break_.start_time && timeToFloat(hour, halfHour) < break_.end_time) {
                return true;
            }
        }

        // Check one-time breaks for the specific day
        for (const break_ of oneTimeBreaks) {
            const breakDate = new Date(break_.date).toDateString();
            const currentDay = new Date(day).toDateString();
            if (breakDate === currentDay) {
                if (timeToFloat(hour, halfHour) >= break_.start_time && timeToFloat(hour, halfHour) < break_.end_time) {
                    return true;
                }
            }
        }

        return false;
    };

    const renderTasks = (day, hour) => {
        const taskToRender = tasks.find((task) => {
            const taskStartHour = moment(task.start, 'HH:mm').hour();
            const taskEndHour = moment(task.end, 'HH:mm').hour();
            return task.day === day && taskStartHour === hour;
        });

        if (taskToRender) {
            const taskStartHour = moment(taskToRender.start, 'HH:mm').hour();
            const taskEndHour = moment(taskToRender.end, 'HH:mm').hour();
            const duration = taskEndHour - taskStartHour;
            return (
                <td key={taskToRender.id} rowSpan={duration} className={styles.taskCell}>
                    <div className={styles.task}>{taskToRender.name}</div>
                </td>
            );
        }

        if (tasks.some((task) => {
            const taskStartHour = moment(task.start, 'HH:mm').hour();
            const taskEndHour = moment(task.end, 'HH:mm').hour();
            return task.day === day && taskStartHour < hour && hour < taskEndHour;
        })) {
            return null;
        }

        return (
            <td
                key={`${day}-${hour}`}
                className={`
          ${isWorkingHour(day, hour) ? styles.highlight : ''} 
          ${isBreakHour(day, hour, false) ? styles.breakHighlight : ''}
        `}
            ></td>
        );
    };

    return (
        <table className={styles.calendar}>
            <thead>
                <tr>
                    <th>Time</th>
                    {daysOfWeek.map((day) => (
                        <th key={day}>{day}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {hours.map((hour) => (
                    <tr key={hour}>
                        <td>{`${hour}:00`}</td>
                        {daysOfWeek.map((day) => renderTasks(day, hour))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TaskSchedule;
