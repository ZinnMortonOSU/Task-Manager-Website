import { useState, useEffect, useRef, useLayoutEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import axios from "axios";

import "./index.css";

function Index() {
    const [tasks, setTasks] = useState([]);
    const [fetch_error, setFetchError] = useState(false);
    const [create_error, setCreateError] = useState(false);

    const input_ref = useRef(null);
    const submit_ref = useRef(null);

    useEffect(() => {
        fetchTasks();

        resizeSubmit();
        window.addEventListener("resize", resizeSubmit);

        return () => {
            window.removeEventListener("resize", resizeSubmit);
        };
    }, []);

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            createTask();
        }
    }

    function resizeSubmit() {
        if (submit_ref.current && input_ref.current) {
            submit_ref.current.style.height = input_ref.current.style.height;
        }
    }

    async function fetchTasks() {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/tasks`);
            setTasks(response.data);
        } catch (err) {
            setFetchError(true);
        }
    }

    async function createTask() {
        try {
            const response = await axios.post("http://localhost:5000/api/v1/tasks", { name: input_ref.current.value });
            fetchTasks();
            input_ref.current.value = "";
            setCreateError(false);
        } catch (err) {
            setCreateError(true);
        }
    }

    const task_list_inject = tasks.map((task) => {
        return <Task id={task._id} name={task.name} completed={task.completed} fetchTasks={fetchTasks} />;
    });

    return (
        <>
            <h1 className="title">Task Manager</h1>
            <div className="add-task">
                <h2>Add Task</h2>
                <div>
                    <TextareaAutosize name="new-task" id="new-task-name" onKeyDown={(e) => handleKeyDown(e)} onHeightChange={() => resizeSubmit()} ref={input_ref} maxLength="100" minRows="3"></TextareaAutosize>
                    <button onClick={() => createTask()} ref={submit_ref}>
                        Submit
                    </button>
                </div>
                {create_error ? (
                    <div className="error-text-div">
                        <h2 className="error-text">Error adding task</h2>
                    </div>
                ) : null}
            </div>
            {fetch_error ? <h2 className="error-text">Error finding tasks</h2> : <ul className="task-list">{task_list_inject}</ul>}
        </>
    );
}

function Task({ id, name, completed, fetchTasks }) {
    const [editing, setEditing] = useState(false);
    const [completed_checked, setCompletedChecked] = useState(completed);
    const [edit_task_input, setEditTaskInput] = useState(name);
    const task_input_ref = useRef(null);

    function toggleEdit() {
        if (editing) {
            setEditTaskInput(name);
            setCompletedChecked(completed);
        }

        setEditing(!editing);
    }

    function handleInput(e) {
        setEditTaskInput(() => {
            return e.target.value;
        });
    }

    async function deleteTask(id) {
        try {
            const response = await axios.delete(`http://localhost:5000/api/v1/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            alert("Error deleting task");
        }
    }

    async function editTask(id) {
        try {
            const response = await axios.patch(`http://localhost:5000/api/v1/tasks/${id}`, { name: edit_task_input, completed: completed_checked });
            toggleEdit();
            fetchTasks();
        } catch (err) {
            alert("Error modifying task");
        }
    }

    return editing ? (
        <div className={completed ? "task completed-task" : "task"}>
            <input className="completed-checkbox" type="checkbox" checked={completed_checked} onChange={() => setCompletedChecked(!completed_checked)}></input>
            <TextareaAutosize ref={task_input_ref} className="edit-task-name" value={edit_task_input} onChange={(e) => handleInput(e)} maxLength="100" minRows="3"></TextareaAutosize>
            <div>
                <button className="edit-task" onClick={() => toggleEdit()}>
                    Cancel
                </button>
                <button className="edit-task-submit" onClick={() => editTask(id)}>
                    Submit
                </button>
            </div>
        </div>
    ) : (
        <div className={completed ? "task completed-task" : "task"}>
            <h3>{name}</h3>
            <div>
                <button className="edit-task" onClick={() => toggleEdit()}>
                    Edit
                </button>
                <button className="delete-task" onClick={() => deleteTask(id)}>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default Index;
