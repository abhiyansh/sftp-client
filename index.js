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

let sseClients = [];
app.get("/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    sseClients.push(res);
    for (const [key, value] of Object.entries(getProcessedFiles())) {
        res.write(`${JSON.stringify({[key]: value})}\n`);
    }

    req.on("close", () => {
        sseClients = sseClients.filter(client => client !== res);
    });
});

function sendNewJsonDataToClients(fileName, jsonData) {
    sseClients.forEach(client => {
        client.write(`${JSON.stringify({[fileName]: jsonData})}\n`);
    });
}

app.get("/config", (req, res) => {
    res.json(configStore.get());
});

app.post("/connect", async (req, res) => {
    const errors = await validateConfig(req.body);
    if (errors.length > 0) {
        return res.status(400).json({message: "Invalid configuration", errors});
    }
    configStore.update(req.body);
    if (pollingWorkerId) clearInterval(pollingWorkerId);
    pollingWorkerId = startPoller(sendNewJsonDataToClients);
    res.json({message: "Successfully connected to the server"});
});

app.get("/health", (req, res) => {
    res.send("Server is up and running!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
