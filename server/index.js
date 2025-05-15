import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import ProcessedFileNotifier from "./processed-file-notifier.js";
import SftpPollingJob from "./sftp-polling-job.js";
import ProcessedFileStore from "./processed-file-store.js";
import PollingJobOrchestrator from "./polling-job-orchestrator.js";
import {SFTP_POLLING_JOB_NOT_RUNNING} from "../shared/constants.js";
import {INIT_CONFIG, SftpConfig} from "../shared/sftp-config.js";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173',
}));

const processedFileStore = new ProcessedFileStore();
const notifier = new ProcessedFileNotifier(processedFileStore);
const jobOrchestrator = new PollingJobOrchestrator();
const sftpConfig = new SftpConfig(INIT_CONFIG);

app.get("/events", (req, res) => {
    res.set({'Content-Type': 'text/event-stream'});

    if (!jobOrchestrator.isJobRunning()) {
        notifier.raiseEventOnClient(res, SFTP_POLLING_JOB_NOT_RUNNING, {"message": "Connect with SFTP server to start receiving files"})
        return;
    }

    notifier.addClient(res);
    notifier.notifyNewClientOfProcessedFiles(res);
    req.on("close", () => {
        notifier.removeClient(res);
    });
});

app.get("/config", (req, res) => {
    res.json(sftpConfig.config);
});

app.post("/connect", async (req, res) => {
    sftpConfig.setConfig(req.body);
    const errors = sftpConfig.validate();

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({message: "Invalid configuration", errors});
    }

    const sftpPollerJob = new SftpPollingJob(sftpConfig, notifier, processedFileStore);

    try {
        await sftpPollerJob.connect();
    } catch (err) {
        return res.status(400).json({message: "Failed to connect to the SFTP server"});
    }

    jobOrchestrator.startJob(sftpPollerJob, sftpConfig.config.pollInterval);
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
