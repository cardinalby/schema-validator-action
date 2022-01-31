import {getFilePaths} from "../../src/getFilePaths";

describe('getFilePath', () => {
    it('should find single file', async () => {
        const res = await getFilePaths('package.json');
        expect(res).toEqual(['package.json']);
    });

    it('should find glob', async () => {
        const res = await getFilePaths('tests/unit/data/a*c.json');
        expect(res.sort()).toEqual([
            'tests/unit/data/abc.json',
            'tests/unit/data/abac.json'
        ].sort());
    });

    it('should find multiple files', async () => {
        const res = await getFilePaths('package.json|LICENSE|action.yml');
        expect(res.sort()).toEqual([
            'package.json',
            'LICENSE',
            'action.yml'
        ].sort());
    });

    it('should find multiple globs', async () => {
        const res = await getFilePaths('tests/unit/data/*.json|tests/unit/data/*.xml');
        expect(res.sort()).toEqual([
            'tests/unit/data/abc.json',
            'tests/unit/data/abac.json',
            'tests/unit/data/abc.xml',
            'tests/unit/data/def.xml',
        ].sort());
    });
});