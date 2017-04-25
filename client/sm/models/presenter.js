import { observe } from 'mobx';
import Asset from 'lanes/models/asset';
import {
    BaseModel, identifiedBy, identifier, belongsTo, field, computed,
} from './base';

@identifiedBy('sm/presenter')
export default class Presenter extends BaseModel {

    @identifier id;

    @field code = '';
    @field name = '';

    @belongsTo({ model: Asset, inverseOf: 'owner' }) logo;

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

    @computed static get sharedCollection() {
        return this.$cachedCollection ||
            (this.$cachedCollection = this.Collection.create([], { fetch: true }));
    }

}
