import {validate} from "../../src/main";
import {SchemaValidatorError} from "../../src/errors";

describe('main', () => {
    it('should validate action.yml against github-action schema', async () => {
        await validate('https://json.schemastore.org/github-action.json', 'action.yml');
    });

    it('should validate action.yml against angular schema', async () => {
        try {
            await validate(
                'https://raw.githubusercontent.com/angular/angular-cli/master/packages/angular/cli/lib/config/workspace-schema.json',
                'action.yml'
            )
            fail('Should throw');
        } catch (err) {
            expect(err).toBeInstanceOf(SchemaValidatorError)
            expect((err as SchemaValidatorError).errorType).toBe('validation');
        }
    });

    it('should validate package.json against schema', async () => {
        await validate('tests/integration/package.schema.json', 'package.json');
    });

    it('should throw schema error', async () => {
        try {
            await validate('LICENSE', 'package.json');
            fail('Should throw');
        } catch (err) {
            expect(err).toBeInstanceOf(SchemaValidatorError)
            expect((err as SchemaValidatorError).errorType).toBe('schema');
        }
    });

    it('should throw file error', async () => {
        try {
            await validate('tests/integration/package.schema.json', 'LICENSE');
            fail('Should throw');
        } catch (err) {
            expect(err).toBeInstanceOf(SchemaValidatorError)
            expect((err as SchemaValidatorError).errorType).toBe('file');
        }
    });
});