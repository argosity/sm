import {
    BaseModel, identifiedBy, identifier, belongsTo, hasMany, field, computed
} from './base';

@identifiedBy('sh/event')
export default class Event extends BaseModel {

    @identifier id;

    @field code;
    @field title;
    @field sub_title;
    @field email_signature;

    @field({ type: 'date' }) valid_after;
    @field({ type: 'date' }) valid_until;

}
