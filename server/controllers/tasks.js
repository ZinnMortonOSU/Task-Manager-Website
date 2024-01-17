const Task = require("../models/Task.js");
const asyncWrapper = require("../middleware/async.js");

const getAllTasks = asyncWrapper(async (req, res) => {
    const all_tasks = await Task.find({});
    res.status(200).json(all_tasks);
});

const createTask = asyncWrapper(async (req, res) => {
    const task = await Task.create(req.body);
    res.status(200).json(task);
});

const deleteTask = asyncWrapper(async (req, res) => {
    const { id } = req.params;

    const deleted_task = await Task.findOneAndDelete({ _id: id });

    if (!deleted_task) {
        return res.status(404).json({ err: `Task not found` });
    }

    res.status(200).json(deleted_task);
});

const editTask = asyncWrapper(async (req, res) => {
    const { id } = req.params;

    const edited_task = await Task.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });

    if (!edited_task) {
        return res.status(404).json({ err: "Task not found" });
    }

    res.status(200).json(edited_task);
});

module.exports = { getAllTasks, createTask, deleteTask, editTask };