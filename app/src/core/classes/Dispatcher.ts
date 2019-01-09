import EventEmitter from 'eventemitter3';
import { decorate, injectable } from 'inversify';

export type EventTypes = 'register' | 'registered' | 'boot' | 'booted';

decorate(injectable(), EventEmitter);

@injectable()
export class Dispatcher extends EventEmitter<EventTypes> {
}
