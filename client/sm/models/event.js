import isPast   from 'date-fns/is_past';
import isFuture from 'date-fns/is_future';
import Asset from 'lanes/models/asset';
import { renameProperties } from 'lanes/lib/util';
import Big from 'big.js';
import { sprintf } from 'sprintf-js';
import { observe } from 'mobx';
import { pick } from 'lodash';
import {
    BaseModel, identifiedBy, identifier, field, belongsTo, computed, hasMany,
} from './base';

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

    @field({ type: 'date' }) occurs_at;

    @field({ type: 'date' }) visible_after;
    @field({ type: 'date' }) visible_until;

    @field({ type: 'date' }) onsale_after;
    @field({ type: 'date' }) onsale_until;

    @field external_url;
    @field page_src;
    @field page_html;

    @field capacity;

    @belongsTo({ model: 'sm/venue' }) venue;
    @belongsTo({ model: 'sm/presenter' }) presenter;
    @belongsTo({ model: Asset, inverseOf: 'owner' }) image;

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

}
