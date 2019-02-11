import { default as BaseInspireTree } from 'inspire-tree';
import { FQSEN, IFQSEN, PhpdocManifest } from '../../logic';

export class InspireTree extends BaseInspireTree {
    _syncable   = true;
    _syncer     = (tree: this) => null;
    manifest    = (): PhpdocManifest => this.opts.manifest;
    fqsenNode   = (fqsen: IFQSEN) => {
        fqsen               = FQSEN.from(fqsen);
        let slashEntityName = fqsen.slashEntityName;
        if ( ! this.opts.manifest.files.has(slashEntityName) ) {
            return this.node(slashEntityName);
        }
        let file = this.opts.manifest.files.get(slashEntityName);
        return this.node(file.hash);
    };
    setSyncable = (syncable) => {
        this._syncable = syncable;
        return this;
    }
    setSyncer   = (syncer) => {
        this._syncer = syncer;
        return this;
    }
    isSyncable  = () => this._syncable;
    sync        = () => {
        if ( this._syncable ) {
            this._syncer(this);
        }
        return this;
    };
}
