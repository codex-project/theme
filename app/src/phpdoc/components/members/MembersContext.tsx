import { FQSEN, PhpdocFile, PhpdocManifest } from '../../logic';
import React from 'react';
import { ItemStore } from './ItemStore';

export interface MembersContextValue {
    manifest: PhpdocManifest
    file: PhpdocFile
    fqsen: FQSEN
    itemStore: ItemStore
}

export let MembersContext  = React.createContext<MembersContextValue>({ manifest: null, file: null, fqsen: null, itemStore: null });
MembersContext.displayName = 'MembersContext';
