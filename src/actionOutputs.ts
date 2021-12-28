import { ActionTrOutput } from 'github-actions-utils';

export type ErrorType = 'file'|'schema'|'validation'|'';

export const actionOutputs = {
    errorType: new ActionTrOutput<ErrorType>('errorType', v => v)
}
