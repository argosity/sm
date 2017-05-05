import Config from 'lanes/config';
import Sync from 'lanes/models/sync';

import {
    EmbeddedBaseModel, identifiedBy, field, identifier, computed, session, hasMany,
} from './model';

import { observable } from 'mobx';
import Payment from './payment';

@identifiedBy('sm/purchase')
export default class Purchase extends EmbeddedBaseModel {

    @identifier id;

    @session token;

    @field name;
    @field phone;
    @field email;

    @field qty = 1;
    @field event_identifer;

    @observable _event;

    @hasMany({ model: Payment }) payments;

    @computed get syncUrl() {
        return `${Config.api_path}/sm/embed/purchase`;
    }

    @computed get event() {
        return this._event;
    }

    set event(ev) {
        this.event_identifer = ev.event_identifier;
        this._event = ev;
    }

    constructor(attrs) {
        super(attrs);
        Sync.forModel(this, { action: 'read' }); // fetch token
    }
}
