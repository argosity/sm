import moment from 'moment';
import {
    BaseModel, identifiedBy, identifier, belongsTo, field, action,
} from './base';

@identifiedBy('sm/event-occurrence')
export default class EventOccurrence extends BaseModel {
    @identifier id;

    @belongsTo({ model: 'sm/event' }) event;

    @field price;
    @field capacity;
    @field({ type: 'date' }) occurs_at = moment().add(1, 'week').toDate();

    @action.bound
    onDelete() {
        if (!this.event.isNew) {
            this.destroy();
        }
        this.event.occurrences.remove(this);
    }
}
