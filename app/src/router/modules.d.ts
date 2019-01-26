// noinspection ES6UnusedImports
import api from '@codex/api';
// noinspection ES6UnusedImports
import React from 'react';
// noinspection ES6UnusedImports
import H,{History} from 'history'
declare global {
    const BACKEND_DATA: api.Query;

    interface Window{
        history:H.History
    }
    // interface History extends H.History {}
}

interface Window{
    history:H.History
}
