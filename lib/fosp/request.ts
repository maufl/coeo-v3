// Request class
import { Message, messageToString } from './message';

export type Method = "OPTIONS" | "AUTH" | "GET" | "LIST" | "CREATE" | "PATCH" | "DELETE" | "READ" | "WRITE";
export const OPTIONS: Method = "OPTIONS",
AUTH: Method = "AUTH",
GET: Method = "GET",
LIST: Method = "LIST",
CREATE: Method = "CREATE",
PATCH: Method = "PATCH",
DELETE: Method = "DELETE",
READ: Method = "READ",
WRITE: Method = "WRITE";
export const Methods: string[] = [OPTIONS, AUTH, GET, LIST, CREATE, PATCH, DELETE, READ, WRITE];

export interface Request extends Message {
  method: Method,
  resource: string
}

export const requestToString = (req: Request) => `${req.method} ${req.resource} :: ${messageToString(req)}`

export const validateRequest = (req: Request) => {
    if (req.method === WRITE && !(req.body instanceof Blob)) {
        throw new Error("Invalid body for WRITE request");
    }
}
