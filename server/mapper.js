class Mapper {
    constructor(mapping, keyToIgnoreForMapping) {
        this.mapping = mapping;
        this.keyToIgnoreForMapping = keyToIgnoreForMapping;
    }

    applyMapping(obj) {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            if (key === this.keyToIgnoreForMapping) {
                result[key] = value;
                continue;
            }
            result[key] = this.mapValue(value);
        }
        return result;
    }

    mapValue(value) {
        if (value === null) {
            return null;
        }

        if (typeof value === "string") {
            return this.mapping.hasOwnProperty(value) ? this.mapping[value] : value;
        }

        if (Array.isArray(value)) {
            return value.map(item => this.mapValue(item));
        }

        if (typeof value === "object") {
            return this.applyMapping(value);
        }

        return value;
    }
}

export default Mapper;
