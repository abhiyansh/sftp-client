const express = require("express");
const configStore = require("./configStore");
const bodyParser = require("body-parser");
const startPoller = require("./sftpPoller");
const validateConfig = require("./validateConfig");
const cors = require('cors');
const ProcessedFileNotifier = require("./ProcessedFileNotifier");
const SftpPollerJob = require("./SftpPollerJob");
const ProcessedFileStore = require("./ProcessedFileStore");

const app = express();
const PORT = 3000;
let pollingWorkerId = null;

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173',
}));

const processedFileStore = new ProcessedFileStore();
const notifier = new ProcessedFileNotifier(processedFileStore);
app.get("/events", (req, res) => {
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
    });

    if (!configStore.get()) {
        notifier.raiseEventOnClient(res, 'SFTP_CONFIG_MISSING', {"message": "Connect with SFTP server to start receiving files"})
        return;
    }

    notifier.addClient(res);
    notifier.notifyNewClientOfProcessedFiles(res);
    req.on("close", () => {
        notifier.removeClient(res);
    });
});

app.get("/config", (req, res) => {
    res.json(configStore.get());
});

app.post("/connect", async (req, res) => {
    const {sftpConfig, pollInterval, indicationMap} = req.body;
    const config = {
        sftpConfig: {
            ...sftpConfig,
            remotePath: sftpConfig.remotePath ? sftpConfig.remotePath : '/',
            port: sftpConfig.port ? sftpConfig.port : 22
        },
        pollInterval: pollInterval ? +pollInterval : 1000,
        indicationMap: indicationMap ? indicationMap : {},
    };

    const errors = await validateConfig(config);

    let sftpPollerJob = new SftpPollerJob(config, notifier, processedFileStore);

    try {
        await sftpPollerJob.connect();
    } catch (err) {
        errors.push(`Failed to connect to the SFTP server`);
    }

    if (errors.length > 0) {
        return res.status(400).json({message: "Invalid configuration", errors});
    }
    configStore.update(config);
    if (pollingWorkerId) clearInterval(pollingWorkerId);
    pollingWorkerId = startPoller(sftpPollerJob);
    res.json({message: "Successfully connected to the server"});
});

app.post("/disconnect", async (req, res) => {
    if (pollingWorkerId) {
        clearInterval(pollingWorkerId);
        pollingWorkerId = null;
        processedFileStore.clearProcessedFiles();
        return res.status(200).json({message: "Successfully disconnected from the SFTP server"});
    }
    return res.status(400).json({message: "Not connected to the SFTP server"});
});

app.get("/health", (req, res) => {
    res.send("Server is up and running!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
