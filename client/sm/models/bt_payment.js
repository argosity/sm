import {
    BaseModel, identifiedBy, field,
} from './base';

@identifiedBy('sm/bt_payment')
export default class BTPayment extends BaseModel {
    @field nonce;
    @field card_type;
    @field digits;
    @field amount;
}
