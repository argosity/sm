import { sumBy } from 'lodash';
import { observable } from 'mobx';
import {
    BaseModel, identifiedBy, identifier, session, field, belongsTo, computed, hasMany,
} from './base';
import Redemption from './redemption';

@identifiedBy('sm/sale')
export default class Sale extends BaseModel {
    @identifier id;

    @session purchase_id;
    @session event_id;
    @session event_occurrence_id;
    @session purchase_identifier;
    @session name;
    @session phone;
    @session email;
    @session qty;
    @session({ type: 'date' }) created_at;

    @session({ type: 'object' }) redemptions;

    @computed get remainingQty() {
        return this.qty - sumBy(this.redemptions, 'qty');
    }

}
