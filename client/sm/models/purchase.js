import {
    BaseModel, identifiedBy, field, identifier, computed, session, hasMany,
} from './base';

import Config from 'lanes/config';
import BTPayment from './bt_payment';

@identifiedBy('sm/purchase')
export default class Purchase extends BaseModel {

    @identifier id;

    @session token;

    @field name;
    @field phone;
    @field email;

    @field qty = 1;
    @field event_id;

    @hasMany({ model: BTPayment }) payments;

    @computed get syncUrl() {
        return `${Config.api_path}/sm/public/purchase`;
    }

}
