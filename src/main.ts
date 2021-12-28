import * as ghActions from '@actions/core';
import { actionInputs } from './actionInputs';
import { actionOutputs } from './actionOutputs';
import * as fs from 'fs-extra'
import {isValidHttpUrl} from "./utils";
import got from "got";
import Ajv from "ajv";
import YAML from 'yaml'

// noinspection JSUnusedLocalSymbols
async function run(): Promise<void> {
    try {
        await runImpl();
    } catch (error) {
        ghActions.setFailed(error.message);
    }
}

async function runImpl() {
   const ajv = new Ajv({allErrors: true});

   let file;
   try {
       file = readData((await fs.readFile(actionInputs.file)).toString(), 'file');
   } catch (err) {
       actionOutputs.errorType.setValue('file');
       throw new Error('Error reading file. ' + err);
   }

    let validate;
    try {
        const schema = readData(await readSchemaContents(actionInputs.schema), 'schema');
        validate = ajv.compile(schema);
    } catch (err) {
        actionOutputs.errorType.setValue('schema');
        throw new Error('Error reading schema. ' + err);
    }

    if (!validate(file)) {
        actionOutputs.errorType.setValue('validation');
        ghActions.error(JSON.stringify(validate.errors));
        throw new Error('Validation error');
    }
}

function readData(data: string, name: string): any {
    try {
        ghActions.info(`Parsing ${name} as JSON...`);
        return JSON.parse(data);
    } catch (err) {
        ghActions.info(`${name} is not a valid JSON`);
    }
    try {
        return YAML.parse(data)
    } catch (err) {
        ghActions.info(`${name} is not a valid YAML`);
    }
    throw new Error(`${name} is not a valid JSON or YAML`);
}

async function readSchemaContents(schemaPath: string): Promise<string> {
    if (isValidHttpUrl(schemaPath)) {
        ghActions.info(`Loading schema from URL: ${schemaPath}`);
        return got.get(schemaPath).text();
    }
    ghActions.info(`Loading schema from file: ${schemaPath}`);
    return (await fs.readFile(schemaPath)).toString();
}

// noinspection JSIgnoredPromiseFromCall
run();
