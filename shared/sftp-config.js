export const INIT_CONFIG = {
    host: '',
    port: 22,
    username: '',
    password: '',
    remotePath: '/',
    pollInterval: 1000,
    indicationMap: '{}',
};

export class SftpConfig {
    constructor(config) {
        this.setConfig(config);
    }

    setConfig(config){
        this.config = {
            ...config,
            port: config.port ? config.port : INIT_CONFIG.port,
            remotePath: config.remotePath ? config.remotePath : INIT_CONFIG.remotePath,
            pollInterval: config.pollInterval ? config.pollInterval : INIT_CONFIG.pollInterval,
            indicationMap: config.indicationMap ? (typeof config.indicationMap == "object" ? JSON.stringify(config.indicationMap) : config.indicationMap) : INIT_CONFIG.indicationMap
        }
    }

    validate() {
        const errors = {};
        if (!this.config.host.trim()) errors.host = 'Host is required';
        if (this.config.port) {
            if (isNaN(this.config.port) || this.config.port < 1 || this.config.port > 65535) {
                errors.port = 'Port must be a number between 1 and 65535';
            }
        }
        if (!this.config.username.trim()) errors.username = 'Username is required';
        if (!this.config.password.trim()) errors.password = 'Password is required';
        if (
            typeof this.config.pollInterval !== "number" ||
            isNaN(this.config.pollInterval) ||
            this.config.pollInterval <= 0
        ) errors.pollInterval = "pollInterval must be a positive number (milliseconds).";
        try {
            const indicationMap = this.getIndicationMapObject();
            if (
                typeof indicationMap !== "object" ||
                Array.isArray(indicationMap)
            ) {
                errors.indicationMap = "indicationMap must be an object.";
            } else {
                for (const [key, val] of Object.entries(indicationMap)) {
                    if (typeof key !== "string" || typeof val !== "string") {
                        if (!errors.indicationMap) errors.indicationMap = [];
                        errors.indicationMap.push(`Invalid mapping: "${key}" => "${val}". Both must be strings.`);
                    }
                }
            }
        } catch (err) {
            errors.indicationMap = "indicationMap must be a valid JSON.";
        }
        return errors;
    }

    getIndicationMapObject() {
        return JSON.parse(this.config.indicationMap);
    }
}
