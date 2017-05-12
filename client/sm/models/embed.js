import {
    BaseModel, identifiedBy, identifier,
} from './base';

@identifiedBy('sm/embed')
export default class Embed extends BaseModel {

    @identifier id;
}
