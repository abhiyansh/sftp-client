import xml2js from "xml2js";
import Mapper from "./mapper.js";

class XmlToJsonProcessor {
    ATTRIBUTES_KEY = 'attributes';

    constructor(mapping) {
        this.mapper = new Mapper(mapping, this.ATTRIBUTES_KEY);
        this.xmlToJsonParser = new xml2js.Parser({attrkey: this.ATTRIBUTES_KEY});
    }

    async process(rawXmlString) {
        const jsonData = await this.xmlToJsonParser.parseStringPromise(rawXmlString);
        return this.mapper.applyMapping(jsonData);
    }
}

export default XmlToJsonProcessor;
