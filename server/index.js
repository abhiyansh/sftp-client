import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import ProcessedFileNotifier from "./processed-file-notifier.js";
import ProcessedFileStore from "./processed-file-store.js";
import PollingJobOrchestrator from "./polling-job-orchestrator.js";
import {INIT_CONFIG, SftpConfig} from "../shared/sftp-config.js";
import { SERVER_PORT, CLIENT_BASE_URL } from "../shared/config.js";
import createRouter from "./routes/index.js";

const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: CLIENT_BASE_URL,
}));

const processedFileStore = new ProcessedFileStore();
const notifier = new ProcessedFileNotifier(processedFileStore);
const jobOrchestrator = new PollingJobOrchestrator();
const sftpConfig = new SftpConfig(INIT_CONFIG);

const router = createRouter(sftpConfig, notifier, processedFileStore, jobOrchestrator);
app.use(router);

app.listen(SERVER_PORT, () => {
    console.log(`Server running on http://localhost:${SERVER_PORT}`);
});
