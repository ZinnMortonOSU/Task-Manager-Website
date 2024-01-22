const express = require("express");

const { signup, login, getAllTasks, createTask, deleteTask, editTask } = require("../controllers/tasks.js");

const router = express.Router();

// Base path: /api/v1/tasks
router.post("/signup", signup);
router.post("/login", login);
router.get("/", getAllTasks);
router.post("/", createTask);
router.delete("/:id", deleteTask);
router.patch("/:id", editTask);

module.exports = router;
