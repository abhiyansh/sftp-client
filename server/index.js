const express = require("express");
const configStore = require("./configStore");
const bodyParser = require("body-parser");
const startPoller = require("./sftpPoller");
const validateConfig = require("./validateConfig");
const {getProcessedFiles} = require("./fileProcessor");
const cors = require('cors');

const app = express();
const PORT = 3000;
let pollingWorkerId = null;

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173', // Your React app origin (change for prod)
}));

let sseClients = [];
app.get("/events", (req, res) => {
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
    });

    sseClients.push(res);
    for (const [key, value] of Object.entries(getProcessedFiles())) {
        res.write(`data: ${JSON.stringify({[key]: value})}\n\n`);
    }

    req.on("close", () => {
        sseClients = sseClients.filter(client => client !== res);
    });
});

function sendNewJsonDataToClients(fileName, jsonData) {
    sseClients.forEach(client => {
        client.write(`data: ${JSON.stringify({[fileName]: jsonData})}\n\n`);
    });
}

app.get("/config", (req, res) => {
    res.json(configStore.get());
});

app.post("/connect", async (req, res) => {
    const {sftpConfig, pollInterval, indicationMap} = req.body;
    req.body = {
        sftpConfig: {...sftpConfig, remotePath: sftpConfig.remotePath ? sftpConfig.remotePath : '/', port: sftpConfig.port ? sftpConfig.port : 22},
        pollInterval: pollInterval ? +pollInterval : 1000,
        indicationMap: indicationMap ? indicationMap : {},
    };

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
