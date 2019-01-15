export class TunnelState {
    tunnels     = {};
    listeners   = {};
    tunnelsDict = {};

    getListeners(id:string) {
        return this.listeners[ id ] || [];
    }

    subscribe(id:string, fn:Function) {
        this.listeners[ id ] = [ ...this.getListeners(id), fn ];
    }

    unsubscribe(id:string, fn:Function) {
        this.listeners[ id ] = this.getListeners(id).filter(
            listener => listener !== fn,
        );
    }

    setTunnelProps(id:string, itemId:string, props:any) {
        this.tunnels[ id ]     = this.tunnels[ id ] || [];
        this.tunnelsDict[ id ] = this.tunnelsDict[ id ] || {};

        if ( props !== null ) {
            if ( ! this.tunnelsDict[ id ][ itemId ] ) {
                this.tunnels[ id ].push(itemId);
            }
            this.tunnelsDict[ id ][ itemId ] = props;
        } else {
            delete this.tunnelsDict[ id ][ itemId ];
            const idx          = this.tunnels[ id ].indexOf(itemId);
            this.tunnels[ id ] = [
                ...this.tunnels[ id ].slice(0, idx),
                ...this.tunnels[ id ].slice(idx + 1),
            ];
        }

        if ( this.listeners[ id ] ) {
            this.listeners[ id ].forEach(fn => fn(props));
        }
    }

    getTunnelProps(id:string) {
        if ( this.tunnels[ id ] ) {
            return this.tunnels[ id ].length < 2
                   ? this.tunnelsDict[ id ][ this.tunnels[ id ][ 0 ] ]
                   : this.tunnels[ id ].map(i => this.tunnelsDict[ id ][ i ]);
        }

        return null;
    }
}
