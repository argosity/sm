import {
    BaseModel, identifiedBy, identifier, belongsTo, hasMany, field, computed
} from './base';

@identifiedBy('sm/embed')
export default class Embed extends BaseModel {

    @identifier id;

}
