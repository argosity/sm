import { observe } from 'mobx';
import Asset from 'hippo/models/asset';
import {
    BaseModel, identifiedBy, identifier, belongsTo, field, computed,
} from './base';
import moment from 'moment-timezone';

@identifiedBy('sm/venue')
export default class Venue extends BaseModel {
    @identifier id;

    @field code = '';
    @field name = '';
    @field address = '';
    @field phone_number;
    @field capacity;
    @field timezone = moment.tz.guess();

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
        this.$cachedCollection = (
            this.$cachedCollection || this.Collection.create([], { fetch: true })
        );
        return this.$cachedCollection;
    }
}
