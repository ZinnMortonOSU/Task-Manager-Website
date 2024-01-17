const mongoose = require("mongoose");

const task_schema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 100,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    { collection: "Tasks" }
);

module.exports = mongoose.model("Task", task_schema);
