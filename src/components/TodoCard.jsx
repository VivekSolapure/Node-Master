
import './TodoCard.css'
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue, remove, update } from 'firebase/database';

import firebaseApp from './firebaseconfig';
const database = getDatabase(firebaseApp);
const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [editTaskName, setEditTaskName] = useState('');
    const [editTaskDescription, setEditTaskDescription] = useState('');
    const [showAddForm, setShowAddForm] = useState(false); 

    useEffect(() => {
        const todoRef = ref(database, 'todos');
        onValue(todoRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const todoList = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                setTasks(todoList);
            }
        });
    }, []);

    const handleAddTask = () => {
        if (newTaskName.trim() === '') return;
        const newTask = {
            name: newTaskName,
            description: newTaskDescription,
            date: new Date().toLocaleString()
        };
        const todoRef = ref(database, 'todos');
        push(todoRef, newTask);
        setNewTaskName('');
        setNewTaskDescription('');
    };

    const handleRemoveTask = (taskId) => {
        const todoRef = ref(database, `todos/${taskId}`);
        remove(todoRef);
    };

    const handleEditTask = (taskId) => {
        const todoRef = ref(database, `todos/${taskId}`);
        const updates = {
            name: editTaskName,
            description: editTaskDescription
        };
        update(todoRef, updates);
        setEditTaskName('');
        setEditTaskDescription('');
    };

    const handleEditMode = (taskId, currentName) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, editMode: !task.editMode };
            } else {
                return { ...task, editMode: false };
            }
        });
        setTasks(updatedTasks);
        if (!currentName) {
            const taskToEdit = tasks.find(task => task.id === taskId);
            setEditTaskName(taskToEdit.name);
            setEditTaskDescription(taskToEdit.description);
        }
    };

    return (
        <>
            <div className="home_seperation">
              <div className='home_sperationLine'></div>
            </div>

            <div className="home_TodoContainer">
                <div className="home_Todoheading">TO DO</div>
                <div className="home_TodoListContainer">
                    
                    {tasks.map(task => (
                        <div key={task.id} className="home_TodoList">
                            <div className="home_TodoHeading">
                                {task.editMode ? (
                                    <input
                                        type="text"
                                        value={editTaskName}
                                        onChange={(e) => setEditTaskName(e.target.value)}
                                        onBlur={() => handleEditTask(task.id)}
                                        autoFocus
                                    />
                                ) : (
                                    <div className="home_TodoName">{task.name}</div>
                                )}
                                <div className="home_TodoEditLogo" onClick={() => handleEditMode(task.id, task.name)}>
                                    <img src="./edit.svg" alt="" />
                                </div>
                            </div>
                            {task.editMode ? (
                                <textarea
                                    value={editTaskDescription}
                                    onChange={(e) => setEditTaskDescription(e.target.value)}
                                    onBlur={() => handleEditTask(task.id)}
                                    placeholder="Enter task description"
                                />
                            ) : (
                                <div className="home_TodoPara">{task.description}</div>
                            )}
                            <div className="home_TodoPara">{task.date}</div>
                            <button className='rm_btn' onClick={() => handleRemoveTask(task.id)}>Remove</button>
                        </div>
                    ))}
                    <div className="home_TodoListAdd"  onClick={() => setShowAddForm(!showAddForm)}>
                    <img src='./addTask.svg' alt="Add Task" className="plus_icon" /> </div>

                    {showAddForm && (<div className='home_AddTaskForm'>
                        <input
                            type="text"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            placeholder="Enter task name"
                        />
                        <textarea
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                            placeholder="Enter task description"
                        />
                        <div className='add-task_btn'> 
                        <button onClick={handleAddTask}>Add Task</button>
                        </div>
                        </div>)}
                    
                </div>
            </div>
        </>
    )
}

export default TodoList