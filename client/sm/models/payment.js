import {
    BaseModel, identifiedBy, field,
} from './base';

@identifiedBy('sm/payment')
export default class Payment extends BaseModel {

    @field nonce;
    @field card_type;
    @field digits;
    @field amount;

}
