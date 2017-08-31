import Asset from 'hippo/models/asset';
import { observe } from 'mobx';
import { pick, uniqBy, filter, isEmpty } from 'lodash';
import moment from 'moment';
import DateRange from 'hippo/lib/date-range';
import Config from 'hippo/config';
import { renameProperties } from 'hippo/lib/util';
import {
    BaseModel, identifiedBy, identifier, field, belongsTo, computed, hasMany,
} from './base';
import Occurrence from './event-occurrence';

const formatTime = occurs => moment(occurs.occurs_at).format('h:mma');

@identifiedBy('sm/event')
export default class Event extends BaseModel {
    static fetchEmbedded(embedId) {
        return this.Collection
            .create()
            .fetch({ url: `${Config.api_path}/sm/embed/events/${embedId}` });
    }

    @identifier id;

    @field identifier = '';

    @field title = '';
    @field sub_title = '';
    @field description = '';

    @field venue_id;
    @field presenter_id;

    @field price;

    @field({ model: DateRange }) visible_during;

    @field external_url;
    @field({ type: 'object' }) page;

    @field capacity;
    @field can_purchase = false;

    @belongsTo({ model: 'sm/venue' }) venue;
    @belongsTo({ model: 'sm/presenter' }) presenter;
    @belongsTo({ model: Asset, inverseOf: 'owner' }) image;

    @hasMany({ model: Occurrence, inverseOf: 'event' }) occurrences;
    @hasMany({ model: Asset, inverseOf: 'owner' }) page_images;

    constructor(attrs) {
        super(attrs);
        observe(this, 'venue', ({ newValue, oldValue }) => {
            if (newValue &&
                ((!oldValue && !this.capacity) ||
                 (oldValue && this.capacity === oldValue.capacity))) {
                this.capacity = newValue.capacity;
            }
        });
    }

    set(attrs = {}) {
        renameProperties(attrs, {
            image_details: 'image',
            venue_details: 'venue',
        });
        return super.set(attrs);
    }

    @computed get image_details() {
        return this.image ? pick(this.image, 'id', 'file_data') : {};
    }

    @computed get hasPage() {
        return !isEmpty(this.page);
    }

    @computed get futureOccurrences() {
        return filter(this.occurrences, o => o.isFuture);
    }

    @computed get commonTime() {
        const times = uniqBy(this.occurrences, formatTime);
        return 1 === times.length ? formatTime(times[0]) : null;
    }

    @computed get canPurchase() {
        return this.can_purchase;
    }
}
