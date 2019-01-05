import EventEmitter from 'eventemitter3';
export declare type EventTypes = 'register' | 'registered' | 'boot' | 'booted';
export declare class Dispatcher extends EventEmitter<EventTypes> {
}
