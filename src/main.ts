import * as ghActions from '@actions/core';
import * as fs from 'fs-extra'
import {isValidHttpUrl} from "./utils";
import {Validator} from "jsonschema";
import YAML from 'yaml'
import {SchemaValidatorError} from "./errors";
import axios from "axios";

// noinspection JSUnusedLocalSymbols
export async function run(): Promise<void> {
    try {
        await validate(
            ghActions.getInput('schema', {required: true}),
            ghActions.getInput('file', {required: true})
        );
    } catch (error) {
        if (error instanceof SchemaValidatorError) {
            ghActions.setOutput('errorType', error.errorType);
        }
        if (typeof error === 'string' || error instanceof Error) {
            ghActions.setFailed(error.toString());
        } else {
            ghActions.setFailed('Unknown error');
        }
    }
}

export async function validate(schema: string, file: string) {
    let fileObj;
    try {
        fileObj = readData((await fs.readFile(file)).toString(), 'file');
    } catch (err) {
        throw new SchemaValidatorError('file', 'Error reading file. ' + err);
    }

    let schemaObj;
    try {
        schemaObj = readData(await readSchemaContents(schema), 'schema');
    } catch (err) {
        throw new SchemaValidatorError('schema', 'Error reading schema. ' + err);
    }

    const validator = new Validator();
    const result = validator.validate(fileObj, schemaObj);
    if (!result.valid) {
        result.errors.forEach(error => ghActions.error(error.stack));
        throw new SchemaValidatorError('validation', 'Validation error');
    }
    ghActions.info('Validated');
}

function readData(data: string, name: string): any {
    try {
        ghActions.info(`Parsing ${name} as JSON...`);
        const result = JSON.parse(data);
        ghActions.info(`Parsed to ${typeof result}`);
        return result;
    } catch (err) {
        ghActions.info(`${name} is not a valid JSON`);
    }
    try {
        ghActions.info(`Parsing ${name} as YAML...`);
        const result = YAML.parse(data);
        ghActions.info(`Parsed to ${typeof result}`);
        return result;
    } catch (err) {
        ghActions.info(`${name} is not a valid YAML`);
    }
    throw new Error(`${name} is not a valid JSON or YAML`);
}

async function readSchemaContents(schemaPath: string): Promise<string> {
    if (isValidHttpUrl(schemaPath)) {
        ghActions.info(`Loading schema from URL: ${schemaPath}`);
        return (await axios.get(schemaPath, {
            responseType: 'text',
            transformResponse: res => res }
        )).data;
    }
    ghActions.info(`Loading schema from file: ${schemaPath}`);
    return (await fs.readFile(schemaPath)).toString();
}
