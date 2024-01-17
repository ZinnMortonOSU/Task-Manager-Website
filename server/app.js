// Packages
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const port = 5000;

app.use(cors({ origin: "http://localhost:5173" }));

// External files
const connectDB = require("./db/connect.js");
const tasks = require("./routes/tasks.js");
const errorHandler = require("./middleware/error_handler.js");

// Middleware

app.use(express.json());

// Router
app.use("/api/v1/tasks", tasks);

app.use(errorHandler);

// 404
app.all("*", (req, res) => {
    res.status(404).send("Resource not found");
});

async function start() {
    try {
        await connectDB(process.env.MONGO_URI);

        console.log("Connected to database");

        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (err) {
        console.log(`Could not connect to database. Error: ${err}`);
    }
}

start();
