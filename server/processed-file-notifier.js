class ProcessedFileNotifier {
    constructor(processedFileStore) {
        this.clients = [];
        this.processedFileStore = processedFileStore;
    }

    addClient(client) {
        this.clients.push(client);
    }

    removeClient(client) {
        this.clients = this.clients.filter(c => c !== client);
    }

    notifyClients(fileName, jsonData) {
        const payload = JSON.stringify({ [fileName]: jsonData });
        this.clients.forEach(client => {
            client.write(`data: ${payload}\n\n`);
        });
    }

    notifyNewClientOfProcessedFiles(client) {
        for (const [fileName, jsonData] of Object.entries(this.processedFileStore.getProcessedFiles())) {
            const payload = JSON.stringify({ [fileName]: jsonData });
            client.write(`data: ${payload}\n\n`);
        }
    }

    raiseEventOnClient(client, eventName, data) {
        const payload = JSON.stringify(data);
        client.write(`event: ${eventName}\n`);
        client.write(`data: ${payload}\n\n`);
    }
}

export default ProcessedFileNotifier;
