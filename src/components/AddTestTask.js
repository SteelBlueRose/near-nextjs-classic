import React, { useState } from 'react';

const AddTestTask = ({ addTask }) => {
    const [name, setName] = useState('');
    const [day, setDay] = useState('Monday');
    const [start, setStart] = useState('09:00');
    const [end, setEnd] = useState('10:00');

    const handleSubmit = (e) => {
        e.preventDefault();
        addTask({ name, day, start, end });
        setName('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Task Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <select value={day} onChange={(e) => setDay(e.target.value)}>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
            </select>
            <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                required
            />
            <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                required
            />
            <button type="submit">Add Task</button>
        </form>
    );
};

export default AddTestTask;
