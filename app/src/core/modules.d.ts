// noinspection ES6UnusedImports
import api from '@codex/api';
// noinspection ES6UnusedImports
import React from 'react';
// noinspection ES6UnusedImports
import router5, { State } from 'router5';
import { RouterStore } from 'routing';

declare global {
    const BACKEND_DATA: api.Query;
}


declare module 'antd/es/menu' {
    interface MenuProps {
        overflowedIndicator?: React.ReactNode
        renderMenuItem?: any
    }
}

declare module 'antd/lib/menu' {
    interface MenuProps {
        overflowedIndicator?: React.ReactNode
        renderMenuItem?: any
    }
}

declare module 'antd/lib/drawer' {
    interface DrawerProps {
        duration?: string
        ease?: string
        onChange?: Function
        onMaskClick?: Function
        onHandleClick?: Function
    }
}

declare module '@codex/api/types/generated' {
    import { LinkData } from 'routing';

    interface MenuItem {
        __raw?: any
        to?: LinkData
        parent?: string
        custom?: Function
        renderer?: string
    }
}

declare module 'router5/types/types/router' {
    import { DictionaryWrapper } from 'collections/DictionaryWrapper';
    import { RouterStore } from 'routing/RouterStore';

    interface Dependencies {
        [ key: string ]: any

        data?: DictionaryWrapper
        store?: RouterStore
    }
}
