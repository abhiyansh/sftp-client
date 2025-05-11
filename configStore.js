const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.join(__dirname, "config.json");

let config = {
    sftpConfig: null,
    indicationMap: {},
    pollInterval: 1000
};

if (fs.existsSync(CONFIG_PATH)) {
    const data = fs.readFileSync(CONFIG_PATH);
    config = JSON.parse(data);
}

function saveConfig() {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

module.exports = {
    get: () => config,
    update: (newConfig) => {
        config = { ...config, ...newConfig };
        saveConfig();
    }
};
