// components/TaskSchedule.js
import React from 'react';
import moment from 'moment';
import styles from '@/styles/TaskSchedule.module.css';

const TaskSchedule = ({ tasks }) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

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

        return <td key={`${day}-${hour}`}></td>;
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
