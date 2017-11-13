import moment from 'moment-timezone';
import Big from 'big.js';
import { sprintf } from 'sprintf-js';
import { action } from 'mobx';
import { get } from 'lodash';
import Config from 'hippo/config';
import {
    BaseModel, identifiedBy, field, identifier, belongsTo, computed, session,
} from './base';

@identifiedBy('sm/show-time')
export default class ShowTime extends BaseModel {

    @identifier id;

    @session identifier;

    @belongsTo({ model: 'sm/show' }) show;

    @field price;
    @field capacity;
    @field occurs_at; // ({ type: 'date' }) occurs_at = moment()
    // .startOf('day')
    // .add(8, 'hour')
    // .add(1, 'week')
    // .toDate();

    constructor(attrs) {
        super(attrs);
        if (this.show) {
            this.price = (this.price || this.show.price);
            this.capacity = (this.capacity || this.show.capacity);
        }
    }


    @computed get formattedOccursAt() {
        const format = this.show.commonTime ? 'MMM Do YYYY' : 'h:mma MMM Do YYYY';
        const tz = this.show.venue ? this.show.venue.timezone : moment.tz.guess();
        return moment(this.occurs_at).tz(tz).format(format);
    }

    @computed get formattedPrice() {
        return sprintf('%0.2f', this.pricedShow);
    }

    @computed get isFuture() {
        return moment(this.occurs_at).isAfter(new Date());
    }

    @computed get pricedShow() {
        return Big(this.price || get(this.show, 'price', 0));
    }

    @computed get xlsURL() {
        return `${Config.api_path}/sm/show-time/${this.id}/sales-report.xlsx`;
    }

    @action.bound
    onDelete() {
        if (!this.isNew) { this.destroy(); }
        this.show.times.remove(this);
    }

    @computed get canPurchaseOnline() {
        return Boolean(this.show.can_purchase && moment().add(this.show.online_sales_halt_mins_before, 'mimutes').isBefore(this.occurs_at));
    }

}
