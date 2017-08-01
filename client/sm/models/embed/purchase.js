import Config from 'hippo/config';
import Sync from 'hippo/models/sync';
import { sprintf } from 'sprintf-js';
import Big from 'big.js';

import {
    EmbeddedBaseModel, identifiedBy, field, identifier, computed, session, hasMany, belongsTo,
} from './model';
import { observe } from 'mobx';
import Payment from './payment';
import Event from './event';
import EventOccurrence from './event_occurrence';

@identifiedBy('sm/purchase')
export default class Purchase extends EmbeddedBaseModel {
    @identifier({ type: 'string' }) identifier;

    @session token;

    @field name;
    @field phone;
    @field email;

    @field qty = 1;
    @field occurrence_identifier;

    @field tickets_url;

    @belongsTo({ model: Event }) event;
    @hasMany({ model: Payment }) payments;
    @belongsTo({ model: EventOccurrence }) occurrence;

    @computed get syncUrl() {
        return `${Config.api_path}/sm/embed/purchase`;
    }

    constructor(attrs) {
        super(attrs);
        Sync.forModel(this, { action: 'read' }); // fetch token
        observe(this, 'event', ({ newValue: event }) => {
            if (event && event.occurrences.length) {
                this.occurrence = event.occurrences[0];
            } else {
                this.occurrence = null;
            }
        });
    }

    priceForQty(qty = 1) {
        if (!this.occurrence) { return '0.00'; }
        return sprintf('%0.2f', this.occurrence.pricedEvent.times(qty));
    }

}
