import moment from 'moment';
import Big from 'big.js';
import { sprintf } from 'sprintf-js';
import { action } from 'mobx';
import { get } from 'lodash';
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
    @field({ type: 'date' }) occurs_at = moment()
        .startOf('day')
        .add(8, 'hour')
        .add(1, 'week')
        .toDate();

    @computed get formattedOccursAt() {
        const format = this.show.commonTime ? 'MMM Do YYYY' : 'h:mma MMM Do YYYY';
        return moment(this.occurs_at).format(format);
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

    @action.bound
    onDelete() {
        if (!this.show.isNew) {
            this.destroy();
        }
        this.show.times.remove(this);
    }

    @computed get canPurchaseOnline() {
        return Boolean(this.show.can_purchase &&
                       moment()
                           .add(this.show.online_sales_halt_mins_before, 'mimutes')
                           .isBefore(this.occurs_at),
        );
    }

}
