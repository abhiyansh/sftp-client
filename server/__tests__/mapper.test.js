const Mapper = require('../mapper');
import { describe, it, expect } from 'vitest';

describe('applyIndicationMapping', () => {
    const mapping = {
        "A": "Mapped A",
        "B": "Mapped B",
        "C": "Mapped C"
    };

    it('should map string values based on the provided mapping', () => {
        const input = { key1: "A", key2: "B", key3: "C" };
        const expected = { key1: "Mapped A", key2: "Mapped B", key3: "Mapped C" };
        expect(new Mapper(mapping, '').applyMapping(input)).toEqual(expected);
    });

    it('should retain original values if no mapping exists', () => {
        const input = { key1: "D", key2: "E" };
        const expected = { key1: "D", key2: "E" };
        expect(new Mapper(mapping, '').applyMapping(input)).toEqual(expected);
    });

    it('should handle null values', () => {
        const input = { key1: null, key2: { subKey: null }, key3: [null] };
        const expected = { key1: null, key2: { subKey: null }, key3: [null] };
        expect(new Mapper(mapping, '').applyMapping(input)).toEqual(expected);
    });

    it('should handle arrays of strings', () => {
        const input = { key1: ["A", "B", "D"] };
        const expected = { key1: ["Mapped A", "Mapped B", "D"] };
        expect(new Mapper(mapping, '').applyMapping(input)).toEqual(expected);
    });

    it('should handle arrays containing objects', () => {
        const input = { key1: [{ subKey: "A" }, { subKey: "B" }, { subKey: "E" }] };
        const expected = { key1: [{ subKey: "Mapped A" }, { subKey: "Mapped B" }, { subKey: "E" }] };
        expect(new Mapper(mapping, '').applyMapping(input)).toEqual(expected);
    });

    it('should handle nested objects', () => {
        const input = { key1: { subKey1: "A", subKey2: "B" } };
        const expected = { key1: { subKey1: "Mapped A", subKey2: "Mapped B" } };
        expect(new Mapper(mapping, '').applyMapping(input)).toEqual(expected);
    });

    it('should retain the value if the key is ATTRIBUTES_KEY', () => {
        const keyToIgnore = "attributes";
        const input = { [keyToIgnore]: { attr1: "A", attr2: "value2" }, key1: "A" };
        const expected = { [keyToIgnore]: { attr1: "A", attr2: "value2" }, key1: "Mapped A" };
        expect(new Mapper(mapping, keyToIgnore).applyMapping(input)).toEqual(expected);
    });
});
