import Asset from 'hippo/models/asset';
import { observe } from 'mobx';
import { pick, isEmpty, uniqBy, map } from 'lodash';
import moment from 'moment';
import DateRange from 'hippo/lib/date-range';
import { toSentence, renameProperties } from 'hippo/lib/util';
import {
    BaseModel, identifiedBy, identifier, field, belongsTo, computed, hasMany,
} from './base';
import Occurrence from './event_occurrence';

@identifiedBy('sm/event')
export default class Event extends BaseModel {
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
    @field can_purchase;

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

}
