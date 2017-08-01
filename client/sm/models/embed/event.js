import moment from 'moment';
import { map, uniqBy, isEmpty, filter } from 'lodash';

import Config from 'hippo/config';
import Asset from 'hippo/models/asset';
import Occurrence from './event_occurrence';

import {
    EmbeddedBaseModel, identifiedBy, session, belongsTo, computed, identifier, hasMany,
} from './model';
import Presenter from './presenter';
import Venue from './venue';

const formatTime = occurs => moment(occurs.occurs_at).format('h:mma');

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
    @hasMany({ model: Occurrence, inverseOf: 'event' }) occurrences;

    @session onsale_after;
    @session onsale_until;
    @session price;
    @session capacity;
    @session external_url;
    @session can_purchase;

    @belongsTo({ model: Asset }) image;
    @belongsTo({ model: Presenter }) presenter;

    @belongsTo({ model: Venue }) venue;

    @computed get hasPage() {
        return !isEmpty(this.page);
    }

    @computed get canPurchase() {
        return this.can_purchase;
    }

    @computed get futureOccurrences() {
        return filter(this.occurrences, o => o.isFuture);
    }

    @computed get commonTime() {
        const times = uniqBy(this.occurrences, formatTime);
        return 1 === times.length ? formatTime(times[0]) : null;
    }

}
