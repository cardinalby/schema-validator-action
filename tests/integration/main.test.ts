import {RunOptions, RunTarget} from "github-action-ts-run-api";

describe('main', () => {
    const target = RunTarget.jsFile('lib/index.js', 'action.yml');

    it('should validate action.yml against github-action schema', () => {
        const res = target.run(RunOptions.create({
            inputs: {
                file: 'action.yml',
                schema: 'https://json.schemastore.org/github-action.json'
            }
        }));
        expect(res.isSuccess).toEqual(true);
        expect(res.commands.errors).toEqual([]);
        expect(res.commands.outputs).toEqual({});
    });

    it('should validate file by $schema set in file', () => {
        const res = target.run(RunOptions.create({
            inputs: {
                file: 'tests/integration/data/package.schema.json',
            }
        }));
        expect(res.isSuccess).toEqual(true);
        expect(res.commands.errors).toEqual([]);
        expect(res.commands.outputs).toEqual({});
    });

    it('should validate action.yml against angular schema', () => {
        const res = target.run(RunOptions.create({
            inputs: {
                file: 'action.yml',
                schema: 'https://raw.githubusercontent.com/angular/angular-cli/master/packages/angular/cli/lib/config/workspace-schema.json'
            }
        }));
        expect(res.isSuccess).toEqual(false);
        expect(res.commands.errors).not.toEqual([]);
        expect(res.commands.outputs).toEqual({errorType: 'validation'});
    });

    it('should validate package.json against schema', () => {
        const res = target.run(RunOptions.create({
            inputs: {
                file: 'package.json',
                schema: 'tests/integration/data/package.schema.json'
            }
        }));
        expect(res.isSuccess).toEqual(true);
        expect(res.commands.errors).toEqual([]);
        expect(res.commands.outputs).toEqual({});
    });

    it('should throw schema error on invalid schema', () => {
        const res = target.run(RunOptions.create({
            inputs: {
                file: 'package.json',
                schema: 'LICENSE'
            }
        }));
        expect(res.isSuccess).toEqual(false);
        expect(res.commands.errors).not.toEqual([]);
        expect(res.commands.outputs).toEqual({errorType: 'schema'});
    });

    it('should throw schema error on missing schema', () => {
        const res = target.run(RunOptions.create({
            inputs: {
                file: 'package.json'
            }
        }));
        expect(res.isSuccess).toEqual(false);
        expect(res.commands.errors).not.toEqual([]);
        expect(res.commands.outputs).toEqual({errorType: 'schema'});
    });

    it('should throw remote schema error', () => {
        const res = target.run(RunOptions.create({
            inputs: {
                file: 'package.json',
                schema: 'https://dwedwoo430930jfgerno9w04.com/'
            }
        }));
        expect(res.isSuccess).toEqual(false);
        expect(res.commands.errors).not.toEqual([]);
        expect(res.commands.outputs).toEqual({errorType: 'schema'});
    });

    it('should throw file error', () => {
        const res = target.run(RunOptions.create({
            inputs: {
                file: 'LICENSE',
                schema: 'tests/integration/data/package.schema.json'
            }
        }));
        expect(res.isSuccess).toEqual(false);
        expect(res.commands.errors).not.toEqual([]);
        expect(res.commands.outputs).toEqual({errorType: 'file'});
    });

    it('should validate by glob', () => {
        const res = target.run(RunOptions.create({
            inputs: {
                file: 'tests/integration/data/files/package_*.json',
                schema: 'tests/integration/data/package.schema.json'
            }
        }));
        expect(res.isSuccess).toEqual(true);
        expect(res.commands.errors).toEqual([]);
        expect(res.commands.outputs).toEqual({});
    });

    it('should validate list of files', () => {
        const res = target.run(RunOptions.create({
            inputs: {
                file: 'tests/integration/data/files/package_*.json|tests/integration/data/files/3_package.json',
                schema: 'tests/integration/data/package.schema.json'
            }
        }));
        expect(res.isSuccess).toEqual(true);
        expect(res.commands.errors).toEqual([]);
        expect(res.commands.outputs).toEqual({});
    });

    it('should validate list of files with invalid', () => {
        const res = target.run(RunOptions.create({
            inputs: {
                file: 'tests/integration/data/files/*.json',
                schema: 'tests/integration/data/package.schema.json'
            }
        }));
        expect(res.isSuccess).toEqual(false);
        expect(res.commands.errors).not.toEqual([]);
        expect(res.commands.outputs).toEqual({errorType: 'validation'});
    });
});