const express = require("express");

const { getAllTasks, createTask, deleteTask, editTask } = require("../controllers/tasks.js");

const router = express.Router();

// Base path: /api/v1/tasks
router.get("/", getAllTasks);
router.post("/", createTask);
router.delete("/:id", deleteTask);
router.patch("/:id", editTask);

module.exports = router;
