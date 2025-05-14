function applyIndicationMapping(obj, mapping, attributesKey) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        if (key === attributesKey) {
            result[key] = value;
            continue;
        }
        result[key] = mapValue(value, mapping, attributesKey);
    }
    return result;
}

function mapValue(value, mapping, attributesKey) {
    if (value === null) {
        return null;
    }

    if (typeof value === "string") {
        return mapping.hasOwnProperty(value) ? mapping[value] : value;
    }

    if (Array.isArray(value)) {
        return value.map(item => mapValue(item, mapping, attributesKey));
    }

    if (typeof value === "object") {
        return applyIndicationMapping(value, mapping, attributesKey);
    }

    return value;
}


module.exports = {applyIndicationMapping};