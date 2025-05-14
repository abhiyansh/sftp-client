const express = require("express");
const configStore = require("./config-store");
const bodyParser = require("body-parser");
const validateConfig = require("./validate-config");
const cors = require('cors');
const ProcessedFileNotifier = require("./processed-file-notifier");
const SftpPollingJob = require("./sftp-polling-job");
const ProcessedFileStore = require("./processed-file-store");
const PollingJobOrchestrator = require("./polling-job-orchestrator");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173',
}));

const processedFileStore = new ProcessedFileStore();
const notifier = new ProcessedFileNotifier(processedFileStore);
const jobOrchestrator = new PollingJobOrchestrator();

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

    if (errors.length > 0) {
        return res.status(400).json({message: "Invalid configuration", errors});
    }

    const sftpPollerJob = new SftpPollingJob(config, notifier, processedFileStore);

    try {
        await sftpPollerJob.connect();
    } catch (err) {
        return res.status(400).json({message: "Failed to connect to the SFTP server"});
    }

    configStore.update(config);
    jobOrchestrator.startJob(sftpPollerJob, config.pollInterval);
    res.json({message: "Successfully connected to the server"});
});

app.post("/disconnect", async (req, res) => {
    if (jobOrchestrator.isJobRunning()) {
        jobOrchestrator.stopJob();
        return res.status(200).json({message: "Successfully disconnected from the SFTP server"});
    }
    return res.status(400).json({message: "Not connected to the SFTP server"});
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
