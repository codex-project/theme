import React from 'react';
import { Observer } from 'mobx-react';

export function createObservableContext<T>(defaultValue: T, calculateChangedBits?: (prev: T, next: T) => number): React.Context<T> & { Context: React.Context<T> } {
    const Context            = React.createContext<T>(defaultValue, calculateChangedBits);
    const ObservableConsumer = ({ children }) => {
        return <Context.Consumer>{(value) => (
            <Observer>{() => {
                return children(value);
            }}</Observer>
        )}</Context.Consumer>;
    };
    return { Provider: Context.Provider, Consumer2:Context.Consumer, Consumer: ObservableConsumer, Context } as any;
}
