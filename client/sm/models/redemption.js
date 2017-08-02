import {
    BaseModel, identifiedBy, identifier,
} from './base';

@identifiedBy('sm/redemption')
export default class Redemption extends BaseModel {
    @identifier id;
}
