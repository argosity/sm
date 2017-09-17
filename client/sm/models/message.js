import { action } from 'mobx';
import Asset from 'hippo/models/asset';
import Sync from 'hippo/models/sync';
import {
    CachedModel, identifiedBy, identifier, field, belongsTo,
} from './base';

@identifiedBy('sm/message')
export default class Message extends CachedModel {

    @identifier id;
    @field code;
    @field name;
    @field order_confirmation_subject;
    @field order_confirmation_body;
    @belongsTo({ model: Asset, inverseOf: 'owner' }) ticket_header;
    @belongsTo({ model: Asset, inverseOf: 'owner' }) ticket_footer;

    @action
    fetchDefaults() {
        return Sync.forModel(this, { action: 'read', url: `${this.syncUrl}/defaults` });
    }

}
