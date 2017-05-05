import {
    EmbeddedBaseModel, identifiedBy, field,
} from './model';

@identifiedBy('sm/embed/payment')
export default class Payment extends EmbeddedBaseModel {
    @field nonce;
    @field card_type;
    @field digits;
    @field amount;
}
