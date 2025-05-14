const configStore = require("./configStore");

function startPoller(sftpPollerJob) {
    return setInterval(() => sftpPollerJob.poll(), configStore.get().pollInterval);
}

module.exports = startPoller;
