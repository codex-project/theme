import { ContainerModule, decorate, injectable } from 'inversify';
import { PhpdocStore } from './logic/PhpdocStore';

export const containerModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    bind('store.phpdoc').to(PhpdocStore).inSingletonScope();
});

