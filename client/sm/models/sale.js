import { sumBy } from 'lodash';
import {
    BaseModel, identifiedBy, identifier, session, computed,
} from './base';

@identifiedBy('sm/sale')
export default class Sale extends BaseModel {
    @identifier id;

    @session purchase_id;
    @session show_id;
    @session show_time_id;
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
