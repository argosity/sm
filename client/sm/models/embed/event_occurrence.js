import moment from 'moment';
import Big from 'big.js';
import { sprintf } from 'sprintf-js';
import {
    EmbeddedBaseModel, identifiedBy, field, identifier, belongsTo, computed,
} from './model';

@identifiedBy('sm/embedded/event_occurrence')
export default class EventOccurrence extends EmbeddedBaseModel {
    @identifier({ type: 'string' }) identifier;

    @belongsTo({ model: 'sm/embedded/event' }) event;

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
        return Big(this.price || this.event.price);
    }
}
