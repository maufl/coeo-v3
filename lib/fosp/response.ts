// Response class
import { Message, messageToString } from './message';

export type Status = "SUCCEEDED" | "FAILED";
export const SUCCEEDED: Status = "SUCCEEDED", FAILED: Status = "FAILED";
export const Statuses: string[] = [SUCCEEDED, FAILED];

export interface Response extends Message {
  status: Status,
  code: number
}

export const validateResponse = (resp: Response) => {
    if (resp.code <= 0) {
        throw new Error(`Unknown response code: ${resp.code}`);
    }
}

export const responseToString = (resp: Response) => `${resp.status} ${resp.code} :: ${messageToString(resp)}`
