const mongoose = require("mongoose");

const task_schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 100,
            minlength: 1,
            trim: true
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    { collection: "Tasks" }
);

module.exports = mongoose.model("Task", task_schema);
