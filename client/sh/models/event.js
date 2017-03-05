import {
    BaseModel, identifiedBy, identifier, belongsTo, hasMany, field, computed
} from './base';

@identifiedBy('sh/event')
export default class Event extends BaseModel {

    @identifier id;

}
