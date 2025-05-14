class ProcessedFileStore {
    constructor() {
        this.processedFiles = {};
    }

    getProcessedFiles() {
        return this.processedFiles;
    }

    clearProcessedFiles() {
        this.processedFiles = {};
    }

    isFileProcessed(fileName){
        return fileName in this.processedFiles;
    }

    addProcessedFile(fileName, data) {
        this.processedFiles[fileName] = data;
    }
}

module.exports = ProcessedFileStore;