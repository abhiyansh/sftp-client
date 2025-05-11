const xml2js = require("xml2js");
const configStore = require("./configStore");

let processedFiles = {};

async function parseXmlToJson(xmlData) {
    const parser = new xml2js.Parser();
    return parser.parseStringPromise(xmlData);
}

function applyIndicationMapping(obj, mapping) {
    for (let key in obj) {
        if (typeof obj[key] === "string" && mapping[obj[key]]) {
            obj[key] = mapping[obj[key]];
        } else if (typeof obj[key] === "object") {
            applyIndicationMapping(obj[key], mapping);
        }
    }
}

async function processXML(rawXml, fileName) {
    const jsonData = await parseXmlToJson(rawXml);
    await applyIndicationMapping(jsonData, configStore.get().indicationMap);
    processedFiles[fileName] = jsonData;
    console.log(`Processed and saved`);
}

function getProcessedFiles() {
    return processedFiles;
}

module.exports = {processXML, getProcessedFiles};