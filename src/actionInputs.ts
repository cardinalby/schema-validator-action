import { actionInputs as inputs } from 'github-actions-utils';

export const actionInputs = {
    schema: inputs.getString('schema', true),
    file: inputs.getString('file', true)
}