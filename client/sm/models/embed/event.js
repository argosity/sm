import isPast   from 'date-fns/is_past';
import isFuture from 'date-fns/is_future';
import Config from 'lanes/config';
import {
    EmbeddedBaseModel, identifiedBy, session, belongsTo, computed, identifier,
} from './model';
import Asset from './asset';
import Presenter from './presenter';
import Venue from './venue';
import { sprintf } from 'sprintf-js';
import Big from 'big.js';
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
    @session page_html;
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
        return isPast(this.onsale_after) && isFuture(this.onsale_until);
    }

    priceForQty(qty) {
        return sprintf('%0.2f', Big(this.price).times(qty || 1));
    }

}
