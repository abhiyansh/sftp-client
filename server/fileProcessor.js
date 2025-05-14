const xml2js = require("xml2js");
const configStore = require("./configStore");
const Mapper = require("./mapper");

const ATTRIBUTES_KEY = 'attributes';

async function parseXmlToJson(xmlData) {
    const parser = new xml2js.Parser({ attrkey: ATTRIBUTES_KEY });
    return parser.parseStringPromise(xmlData);
}

async function processXML(rawXml) {
    const jsonData = await parseXmlToJson(rawXml);
    return new Mapper(configStore.get().indicationMap, ATTRIBUTES_KEY).applyMapping(jsonData);
}

module.exports = {processXML, ATTRIBUTES_KEY};
