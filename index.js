const express = require("express");
const configStore = require("./configStore");
const bodyParser = require("body-parser");
const startPoller = require("./sftpPoller");
const validateConfig = require("./validateConfig");
const {getProcessedFiles} = require("./fileProcessor");

const app = express();
const PORT = 3000;
let pollingWorkerId = null;

app.use(bodyParser.json());

app.get("/config", (req, res) => {
    res.json(configStore.get());
});

app.get("/processed-files", (req, res) => {
    res.json(getProcessedFiles());
});

app.post("/config", async (req, res) => {
    const errors = await validateConfig(req.body);
    if (errors.length > 0) {
        return res.status(400).json({message: "Invalid configuration", errors});
    }
    configStore.update(req.body);
    res.json({message: "Configuration updated successfully"});
    if (pollingWorkerId) clearInterval(pollingWorkerId);
    pollingWorkerId = startPoller();
});

app.get("/health", (req, res) => {
    res.send("Server is up and running!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
