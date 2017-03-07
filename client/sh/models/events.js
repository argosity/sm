import {
    BaseModel, identifiedBy, identifier, belongsTo, hasMany, field, computed
} from './base';

@identifiedBy('sh/events')
export default class Events extends BaseModel {

    @identifier id;

}
