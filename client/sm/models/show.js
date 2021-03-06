import Asset from 'hippo/models/asset';
import { pick, uniqBy, filter, isEmpty, find } from 'lodash';
import moment from 'moment';
import DateRange from 'hippo/lib/date-range';
import Config from 'hippo/config';
import { renameProperties } from 'hippo/lib/util';
import Page from 'hippo/models/page';
import {
    BaseModel, identifiedBy, identifier, field, belongsTo, computed, hasMany,
} from './base';
import ShowTime from './show-time';

const formatTime = occurs => moment(occurs.occurs_at).format('h:mma');

@identifiedBy('sm/show')
export default class Show extends Page.hasPageMixin(BaseModel) {

    static get embedURL() {
        return `${Config.api_path}/sm/embed/shows`;
    }

    static fetchEmbedded(embedId) {
        return this.Collection
            .create()
            .fetch({ url: `${this.embedURL}/${embedId}` });
    }

    static fetchPublicShow(id) {
        const show = new Show({ idenfier: id });
        return show.fetch({
            url: this.embedURL,
            query: { show_identifier: id },
        });
    }

    @identifier id;

    @field identifier = '';

    @field title = '';

    @field sub_title = '';

    @field description = '';

    @field venue_id;

    @field message_id;

    @field ticket_instructions;

    @field presenter_id;

    @field price;

    @field capacity;

    @field external_url;

    @field can_purchase = false;

    @field online_sales_halt_mins_before;

    @field({ model: DateRange }) visible_during = new DateRange({
        start: moment().startOf('day').toDate(),
        end: moment().add(1, 'week').endOf('day').toDate(),
    });

    @belongsTo({ model: 'sm/venue' }) venue;

    @belongsTo({ model: 'sm/presenter' }) presenter;

    @belongsTo({ model: Page, inverseOf: 'owner' }) page;

    @belongsTo({ model: Asset, inverseOf: 'owner' }) image;

    @hasMany({ model: ShowTime, inverseOf: 'show' }) times;

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

    @computed get futureTimes() {
        return filter(this.times, o => o.isFuture);
    }

    @computed get commonTime() {
        if (this.times.length < 2) { return null; }
        const times = uniqBy(this.times, formatTime);
        return 1 === times.length ? formatTime(times[0]) : null;
    }

    @computed get onlinePurchasableTimes() {
        return filter(this.times, { canPurchaseOnline: true });
    }

    @computed get canPurchaseOnline() {
        return Boolean(this.can_purchase && find(this.times, { canPurchaseOnline: true }));
    }

}
