import moment from 'moment';
import Big from 'big.js';
import { sprintf } from 'sprintf-js';
import { action } from 'mobx';
import { get } from 'lodash';
import {
    BaseModel, identifiedBy, field, identifier, belongsTo, computed, session,
} from './base';

@identifiedBy('sm/event-occurrence')
export default class EventOccurrence extends BaseModel {
    @identifier id;

    @session identifier;

    @belongsTo({ model: 'sm/event' }) event;

    @field price;
    @field capacity;
    @field({ type: 'date' }) occurs_at = moment().add(1, 'week').toDate();

    @computed get formattedOccursAt() {
        const format = this.event.commonTime ? 'MMM Do YYYY' : 'h:mma MMM Do YYYY';
        return moment(this.occurs_at).format(format);
    }

    @computed get formattedPrice() {
        return sprintf('%0.2f', this.pricedEvent);
    }

    @computed get isFuture() {
        return moment(this.occurs_at).isAfter(new Date());
    }

    @computed get pricedEvent() {
        return Big(this.price || get(this.event, 'price', 0));
    }

    @action.bound
    onDelete() {
        if (!this.event.isNew) {
            this.destroy();
        }
        this.event.occurrences.remove(this);
    }
}
