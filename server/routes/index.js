import express from 'express';
import SftpPollingJob from "../sftp-polling-job.js";
import {SFTP_POLLING_JOB_NOT_RUNNING} from "../../shared/constants.js";

export default function createRouter(sftpConfig, notifier, processedFileStore, jobOrchestrator) {
  const router = express.Router();

  router.get("/events", (req, res) => {
    res.set({
      'Content-Type': 'text/event-stream',
    });

    if (!jobOrchestrator.isJobRunning()) {
      notifier.raiseEventOnClient(res, SFTP_POLLING_JOB_NOT_RUNNING, {
        "message": "Connect with SFTP server to start receiving files"
      });
      return;
    }

    notifier.addClient(res);
    notifier.notifyNewClientOfProcessedFiles(res);
    
    req.on("close", () => {
      notifier.removeClient(res);
    });
  });

  router.get("/config", (req, res) => {
    res.json(sftpConfig.config);
  });

  router.post("/connect", async (req, res) => {
    sftpConfig.setConfig(req.body);
    const errors = sftpConfig.validate();

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Invalid configuration", 
        errors
      });
    }

    const sftpPollerJob = new SftpPollingJob(sftpConfig, notifier, processedFileStore);

    try {
      await sftpPollerJob.connect();
    } catch (err) {
      return res.status(400).json({
        message: "Failed to connect to the SFTP server",
        error: err.message
      });
    }

    jobOrchestrator.startJob(sftpPollerJob, sftpConfig.config.pollInterval);
    res.json({message: "Successfully connected to the server"});
  });

  router.post("/disconnect", async (req, res) => {
    if (jobOrchestrator.isJobRunning()) {
      jobOrchestrator.stopJob();
      return res.status(200).json({
        message: "Successfully disconnected from the SFTP server"
      });
    }
    
    return res.status(400).json({
      message: "Not connected to the SFTP server"
    });
  });

  return router;
};
