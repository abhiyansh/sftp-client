const SftpClient = require('ssh2-sftp-client');
const {processXML} = require("./fileProcessor");

class SftpPollingJob {
    constructor(config, notifier, processedFileStore) {
        this.sftp = new SftpClient();
        this.config = config;
        // this.fileProcessor = fileProcessor;
        this.notifier = notifier;
        this.processedFileStore = processedFileStore;
    }

    async connect() {
        try {
            await this.sftp.connect(this.config.sftpConfig);
            console.log('Connected to SFTP server');
        } catch (err) {
            console.error('Failed to connect to SFTP server:', err.message);
            throw err;
        }
    }

    async poll() {
        try {
            const fileList = await this.sftp.list(this.config.sftpConfig.remotePath);
            for (const file of fileList) {
                if (!file.name.endsWith(".xml") || this.processedFileStore.isFileProcessed(file.name)) continue;
                const filePath = `${this.config.sftpConfig.remotePath}/${file.name}`;
                const content = await this.sftp.get(filePath);
                const mappedData = await processXML(content.toString());
                this.processedFileStore.addProcessedFile(file.name, mappedData);
                this.notifier.notifyClients(file.name, mappedData);
                console.log(`Processed and saved`);
            }
        } catch (err) {
            console.error('Error during SFTP polling:', err.message);
        }
    }

    async disconnect() {
        await this.sftp.end();
        this.processedFileStore.clearProcessedFiles();
    }
}

module.exports = SftpPollingJob;
