import Sync from 'hippo/models/sync';
import {
    BaseModel, identifiedBy, identifier, field, action, session,
} from './base';

@identifiedBy('sm/payment')
export default class Payment extends BaseModel {

    @identifier id;

    @field nonce;

    @field card_type;

    @field digits;

    @field amount;

    @session token;

    @action
    fetchToken() {
        return Sync.forModel(this, { action: 'read' });
    }

}
