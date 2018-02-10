import { observe, computed } from 'mobx';
import { BaseModel as HippoBaseModel } from 'hippo/models/base';

export {
    identifiedBy, belongsTo, hasMany,
    action, autorun, field, session, identifier, observable, computed,
} from 'hippo/models/base';

export class BaseModel extends HippoBaseModel {

    static get serverModel() {
        return super.serverModel.replace(/^Sm::/, 'SM::');
    }

}

export class CachedModel extends BaseModel {

    constructor(attrs) {
        super(attrs);
        observe(this, 'syncInProgress', ({ newValue, oldValue }) => {
            if (!oldValue && newValue && newValue.isCreate) {
                if (this.constructor.$cachedCollection) {
                    this.constructor.$cachedCollection.push(this);
                }
            }
        });
    }

    @computed static get all() {
        if (!this.$cachedCollection) {
            this.$cachedCollection = this.Collection.create([], { fetch: true });
            Object.defineProperty(this.$cachedCollection, 'asOptions', {
                get: () => this.$cachedCollection.map(opt => ({
                    id: opt.id, label: `${opt.code}: ${opt.name}`,
                })),
            });
        }
        return this.$cachedCollection;
    }

}
