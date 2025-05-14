const xml2js = require("xml2js");
const configStore = require("./configStore");
const {applyIndicationMapping} = require("./mapper");

let processedFiles = {};

const ATTRIBUTES_KEY = 'attributes';

async function parseXmlToJson(xmlData) {
    const parser = new xml2js.Parser({ attrkey: ATTRIBUTES_KEY });
    return parser.parseStringPromise(xmlData);
}

async function processXML(rawXml) {
    const jsonData = await parseXmlToJson(rawXml);
    return applyIndicationMapping(jsonData, configStore.get().indicationMap, ATTRIBUTES_KEY);

}

function getProcessedFiles() {
    return processedFiles;
}

function clearProcessedFiles() {
    processedFiles = {};
}

module.exports = {processXML, getProcessedFiles, clearProcessedFiles, ATTRIBUTES_KEY};
