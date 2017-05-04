import isPast   from 'date-fns/is_past';
import isFuture from 'date-fns/is_future';

import { renameProperties } from 'lanes/lib/util';
import Big from 'big.js';
import { sprintf } from 'sprintf-js';
import { observe } from 'mobx';
import { pick } from 'lodash';
import Config from 'lanes/config';

import Asset from './asset';

import {
    EmbeddedBaseModel, identifiedBy, identifier, session, belongsTo, computed, hasMany,
} from './model';


import Presenter from './presenter';
import Venue from './venue';

@identifiedBy('sm/embedded/event')
export default class EmbeddedEvent extends EmbeddedBaseModel {

    static fetch(embedId) {
        return this.Collection.create().fetch({url: `${Config.api_path}/sm/public/events/${embedId}`});
    }

    @session embed_identifier;
    @session tenant_slug;
    @session event_identifier;
    @session title;
    @session sub_title;
    @session description;
    @session page_html;
    @session occurs_at;
    @session onsale_after;
    @session onsale_until;
    @session price;
    @session capacity;

    @belongsTo({ model: Asset }) image;
    @belongsTo({ model: Presenter }) presenter;

    @belongsTo({ model: Venue }) venue;

//             json_build_object(
//               'file_data', event_asset.file_data
//             ) as image,

//             json_build_object(
//               'name', presenter.name,
//               'logo', presenter_asset.file_data
//             ) as presenter,

//             json_build_object(
//               'name', venues.name,
//               'address', venues.address,
//               'phone_number', venues.phone_number,
//               'logo', venue_asset.file_data
//             ) as venue



}
