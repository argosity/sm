import Sync from 'hippo/models/sync';
import { sprintf } from 'sprintf-js';
import { action, computed } from 'mobx';
import {
    BaseModel, identifiedBy, field, identifier, session, hasMany, belongsTo,
} from './base';
import Payment from './payment';
import ShowTime from './show-time';

@identifiedBy('sm/purchase')
export default class Purchase extends BaseModel {
    @identifier({ type: 'string' }) identifier;

    @session token;

    @field name;
    @field phone;
    @field email;

    @field qty = 1;
    @field time_identifier;

    @field tickets_url;

    @hasMany({ model: Payment }) payments;
    @belongsTo({ model: ShowTime }) time;

    constructor(attrs = {}) {
        super(attrs);
        if (attrs.show && attrs.show.times.length) {
            this.time = attrs.show.times[0];
        }
    }

    @computed get activityMessage() {
        if (this.errorMessage) { return this.errorMessage; }
        if (this.syncInProgress) {
            if (this.syncInProgress.isFetch) {
                return 'Loading…';
            }
            return 'Purchasing…';
        }
        return '';
    }

    @action
    fetchToken() {
        return Sync.forModel(this, { action: 'read' });
    }

    priceForQty(qty = 1) {
        if (!this.time) { return '0.00'; }
        return sprintf('%0.2f', this.time.pricedShow.times(qty));
    }
}
