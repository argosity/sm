import Sync from 'hippo/models/sync';
import { sprintf } from 'sprintf-js';
import { action } from 'mobx';
import {
    BaseModel, identifiedBy, field, identifier, session, hasMany, belongsTo,
} from './base';
import Payment from './payment';
import EventOccurrence from './event-occurrence';

@identifiedBy('sm/purchase')
export default class Purchase extends BaseModel {
    @identifier({ type: 'string' }) identifier;

    @session token;

    @field name;
    @field phone;
    @field email;

    @field qty = 1;
    @field occurrence_identifier;

    @field tickets_url;

    @hasMany({ model: Payment }) payments;
    @belongsTo({ model: EventOccurrence }) occurrence;

    constructor(attrs = {}) {
        super(attrs);
        if (attrs.event && attrs.event.occurrences.length) {
            this.occurrence = attrs.event.occurrences[0];
        }
    }

    @action
    fetchToken() {
        return Sync.forModel(this, { action: 'read' });
    }

    priceForQty(qty = 1) {
        if (!this.occurrence) { return '0.00'; }
        return sprintf('%0.2f', this.occurrence.pricedEvent.times(qty));
    }
}