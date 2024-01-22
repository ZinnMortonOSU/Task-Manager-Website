const Task = require("../models/Task.js");
const Account = require("../models/Account.js");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../middleware/async.js");

const signup = asyncWrapper(async (req, res) => {
    const new_acc = await Account.create(req.body);

    const token = jwt.sign({ acc_id: new_acc._id, username: new_acc.username }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.status(StatusCodes.OK).json({ token: token });
});

const login = asyncWrapper(async (req, res) => {
    const { username, password } = req.body;

    const acc = await Account.findOne({ username: username });

    if (!acc) {
        res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Account not found" });
    }

    const password_correct = await acc.comparePassword(password);

    if (password_correct) {
        const token = jwt.sign({ acc_id: acc._id, username: acc.username }, process.env.JWT_SECRET, { expiresIn: "30d" });

        res.status(StatusCodes.OK).json({ token: token });
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid password" });
    }
});

const getUsersTasks = asyncWrapper(async (req, res) => {
    const acc = await Account.findOne({ _id: req.user.acc_id });
    const all_tasks = await Task.find({ _id: { $in: acc.tasks } });
    res.status(StatusCodes.OK).json(all_tasks);
});

const createTask = asyncWrapper(async (req, res) => {
    const new_task = await Task.create(req.body);
    await Account.findByIdAndUpdate(req.user.acc_id, { $push: { tasks: new_task._id } });
    res.status(StatusCodes.OK).json(new_task);
});

const deleteTask = asyncWrapper(async (req, res) => {
    const acc = await Account.findOne({ _id: req.user.acc_id });

    const { id } = req.params;

    if (!acc.tasks.includes(id)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ err: "Cannot delete another user's task" });
    }

    const deleted_task = await Task.findOneAndDelete({ _id: id });

    if (!deleted_task) {
        return res.status(StatusCodes.NOT_FOUND).json({ err: `Task not found` });
    }

    res.status(StatusCodes.OK).json(deleted_task);
});

const editTask = asyncWrapper(async (req, res) => {
    const acc = await Account.findOne({ _id: req.user.acc_id });

    const { id } = req.params;

    if (!acc.tasks.includes(id)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ err: "Cannot edit another user's task" });
    }

    const edited_task = await Task.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });

    if (!edited_task) {
        return res.status(StatusCodes.NOT_FOUND).json({ err: "Task not found" });
    }

    res.status(StatusCodes.OK).json(edited_task);
});

module.exports = { signup, login, getUsersTasks, createTask, deleteTask, editTask };
