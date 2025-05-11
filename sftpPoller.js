const SftpClient = require("ssh2-sftp-client");
const fs = require("fs");
const path = require("path");
const configStore = require("./configStore");
const xml2js = require("xml2js");

const POLLED_DIR = path.join(__dirname, "processed_files");
const PROCESSED_PATH = path.join(__dirname, "processed.json");

let processedFiles = fs.existsSync(PROCESSED_PATH)
    ? JSON.parse(fs.readFileSync(PROCESSED_PATH))
    : [];

function markAsProcessed(filename) {
    processedFiles.push(filename);
    fs.writeFileSync(PROCESSED_PATH, JSON.stringify(processedFiles, null, 2));
}

if (!fs.existsSync(POLLED_DIR)) fs.mkdirSync(POLLED_DIR);

async function processFile(xmlData, mapping) {
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlData);

    const applyMapping = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === "string" && mapping[obj[key]]) {
                obj[key] = mapping[obj[key]];
            } else if (typeof obj[key] === "object") {
                applyMapping(obj[key]);
            }
        }
    };

    applyMapping(result);
    return result;
}

async function pollSftp() {
    const {sftpConfig, indicationMap} = configStore.get();
    if (!sftpConfig || !sftpConfig.host) {
        console.log("skipping");
    }

    const sftp = new SftpClient();
    try {
        await sftp.connect(sftpConfig);
        const fileList = await sftp.list(sftpConfig.remotePath);
        for (const file of fileList) {
            if (!file.name.endsWith(".xml") || processedFiles.includes(file.name)) continue;

            const remoteFilePath = `${sftpConfig.remotePath}/${file.name}`;
            const fileData = await sftp.get(remoteFilePath);
            const rawXml = fileData.toString();

            const mappedJson = await processFile(rawXml, indicationMap);
            const outputPath = path.join(POLLED_DIR, `${file.name}.json`);
            fs.writeFileSync(outputPath, JSON.stringify(mappedJson, null, 2));

            console.log(`Processed and saved: ${outputPath}`);
            markAsProcessed(file.name);
        }
        await sftp.end();
    } catch (err) {
        console.error("SFTP Polling error:", err.message);
    }
}

function startPoller() {
    setInterval(pollSftp, configStore.get().pollInterval);
}

module.exports = startPoller;