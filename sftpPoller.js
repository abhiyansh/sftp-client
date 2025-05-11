const SftpClient = require("ssh2-sftp-client");
const configStore = require("./configStore");
const {processXML, getProcessedFiles} = require("./fileProcessor");

async function pollSftp(callback) {
    const {sftpConfig} = configStore.get();

    const sftp = new SftpClient();
    try {
        await sftp.connect(sftpConfig);
        const fileList = await sftp.list(sftpConfig.remotePath);
        for (const file of fileList) {
            if (!file.name.endsWith(".xml") || isFileProcessed(file.name)) continue;

            const remoteFilePath = `${sftpConfig.remotePath}/${file.name}`;
            const fileData = await sftp.get(remoteFilePath);
            await processXML(fileData.toString(), file.name, callback);
        }
        await sftp.end();
    } catch (err) {
        console.error("SFTP Polling error:", err.message);
    }
}

function startPoller(callback) {
    return setInterval(()=>pollSftp(callback), configStore.get().pollInterval);
}

function isFileProcessed(fileName){
    return fileName in getProcessedFiles();
}

module.exports = startPoller;