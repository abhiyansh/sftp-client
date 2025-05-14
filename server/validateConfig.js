const SftpClient = require("ssh2-sftp-client");

async function validateConfig(config) {
    const errors = [];

    if (
        typeof config.pollInterval !== "number" ||
        isNaN(config.pollInterval) ||
        config.pollInterval <= 0
    ) {
        errors.push("pollInterval must be a positive number (milliseconds).");
    }

    if (
        typeof config.indicationMap !== "object" ||
        Array.isArray(config.indicationMap)
    ) {
        errors.push("indicationMap must be an object.");
    } else {
        for (const [key, val] of Object.entries(config.indicationMap)) {
            if (typeof key !== "string" || typeof val !== "string") {
                errors.push(`Invalid mapping: "${key}" => "${val}". Both must be strings.`);
            }
        }
    }

    if (!config.sftpConfig || !config.sftpConfig.host || !config.sftpConfig.username || !config.sftpConfig.password) {
        errors.push("SftpConfig is missing or invalid.");
    }

    return errors;
}

module.exports = validateConfig;