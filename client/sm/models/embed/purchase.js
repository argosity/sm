import Config from 'hippo/config';
import Sync from 'hippo/models/sync';

import {
    EmbeddedBaseModel, identifiedBy, field, identifier, computed, session, hasMany, belongsTo,
} from './model';
import Payment from './payment';
import Event from './event';


@identifiedBy('sm/purchase')
export default class Purchase extends EmbeddedBaseModel {

    @identifier({ type: 'string' }) identifier;

    @session token;

    @field name;
    @field phone;
    @field email;

    @field qty = 1;
    @field event_identifier;

    @field tickets_url;

    @belongsTo({ model: Event }) event;

    @hasMany({ model: Payment }) payments;

    @computed get syncUrl() {
        return `${Config.api_path}/sm/embed/purchase`;
    }

    constructor(attrs) {
        super(attrs);
        Sync.forModel(this, { action: 'read' }); // fetch token
    }
}
