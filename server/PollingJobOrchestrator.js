class PollingJobOrchestrator {
    constructor() {
        this.job = null;
        this.intervalId = null;
    }

    startJob(job, pollingIntervalInMs) {
        if (this.isJobRunning()) {
            this.stopJob();
        }
        this.job = job;
        this.intervalId = setInterval(() => this.job.poll(), pollingIntervalInMs);
    }

    stopJob() {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.job.disconnect();
        this.job = null;
    }

    isJobRunning() {
        return this.intervalId !== null;
    }
}

module.exports = PollingJobOrchestrator;
