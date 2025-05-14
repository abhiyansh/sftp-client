const SftpClient = require("ssh2-sftp-client");
const configStore = require("./configStore");
const {processXML, getProcessedFiles} = require("./fileProcessor");

async function pollSftp(notifier) {
    const {sftpConfig} = configStore.get();

    const sftp = new SftpClient();
    try {
        await sftp.connect(sftpConfig);
        const fileList = await sftp.list(sftpConfig.remotePath);
        for (const file of fileList) {
            if (!file.name.endsWith(".xml") || isFileProcessed(file.name)) continue;

            const remoteFilePath = `${sftpConfig.remotePath}/${file.name}`;
            const fileData = await sftp.get(remoteFilePath);
            await processXML(fileData.toString(), file.name, notifier);
        }
        await sftp.end();
    } catch (err) {
        console.error("SFTP Polling error:", err.message);
    }
}

function startPoller(notifier) {
    return setInterval(()=>pollSftp(notifier), configStore.get().pollInterval);
}

function isFileProcessed(fileName){
    return fileName in getProcessedFiles();
}

module.exports = startPoller;