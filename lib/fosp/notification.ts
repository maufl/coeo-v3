// Notification class
import { Message, messageToString } from './message';

export type Event = "CREATED" | "UPDATED" | "DELETED";
export const CREATED: Event = "CREATED", UPDATED: Event = "UPDATED", DELETED: Event = "DELETED";
export const Events: string[] = [CREATED, UPDATED, DELETED];

export interface Notification extends Message {
    event: Event;
    resource: string
}

export const notificationToString = (ntf: Notification) => `${ntf.event} ${ntf.resource} :: ${messageToString(ntf)}`
