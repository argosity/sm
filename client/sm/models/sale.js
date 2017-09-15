import { sprintf } from 'sprintf-js';
import { sumBy } from 'lodash';
import { computed } from 'mobx';
import {
    BaseModel, identifiedBy, field, identifier, session, hasMany, belongsTo,
} from './base';
import Payment from './payment';
import Show from '../models/show';
import ShowTime from '../models/show-time';

@identifiedBy('sm/sale')
export default class Sale extends BaseModel {

    @identifier({ type: 'string' }) identifier;

    @session token;

    @field name;
    @field phone;
    @field email;

    @field qty = 1;
    @field time_identifier;

    @field tickets_url;
    @session show_id;
    @session show_time_id;
    @session show_identifier;

    @session({ type: 'date' }) created_at;
    @session({ type: 'object' }) redemptions;

    @hasMany({ model: Payment }) payments;
    @belongsTo({ model: ShowTime }) time;
    @belongsTo({ model: Show }) show;

    constructor(attrs = {}) {
        super(attrs);
        if (attrs.show && 1 === attrs.show.times.length) {
            this.time = attrs.show.times[0];
        }
    }

    @computed get remainingQty() {
        return this.qty - sumBy(this.redemptions, 'qty');
    }

    emailReceipt() {
        return this.save({ json: { send_receipt: this.email } });
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

    priceForQty(qty = 1) {
        if (!this.time) { return '0.00'; }
        return sprintf('%0.2f', this.time.pricedShow.times(qty));
    }

}
