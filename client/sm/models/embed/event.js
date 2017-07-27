import { sprintf } from 'sprintf-js';
import moment from 'moment';
import Big from 'big.js';
import { isEmpty } from 'lodash';
import Config from 'hippo/config';
import Asset from 'hippo/models/asset';
import {
    EmbeddedBaseModel, identifiedBy, session, belongsTo, computed, identifier,
} from './model';
import Presenter from './presenter';
import Venue from './venue';

@identifiedBy('sm/embedded/event')
export default class EmbeddedEvent extends EmbeddedBaseModel {
    static fetch(embedId) {
        return this.Collection
            .create()
            .fetch({ url: `${Config.api_path}/sm/embed/events/${embedId}` });
    }

    @identifier({ type: 'string' }) identifier;

    @session embed_identifier;
    @session tenant_slug;
    @session title;
    @session sub_title;
    @session description;
    @session page;
    @session occurs_at;
    @session onsale_after;
    @session onsale_until;
    @session price;
    @session capacity;
    @session external_url;

    @belongsTo({ model: Asset }) image;
    @belongsTo({ model: Presenter }) presenter;

    @belongsTo({ model: Venue }) venue;

    @computed get canPurchase() {
        const now = moment();
        return now.isAfter(this.onsale_after) && now.isBefore(this.onsale_until);
    }

    @computed get hasPage() {
        return !isEmpty(this.page);
    }

    priceForQty(qty) {
        return sprintf('%0.2f', Big(this.price).times(qty || 1));
    }
}
