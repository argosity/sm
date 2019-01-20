import moment from 'moment-timezone';
import Asset from 'hippo/models/asset';
import {
    CachedModel, identifiedBy, identifier, belongsTo, field,
} from './base';

@identifiedBy('sm/venue')
export default class Venue extends CachedModel {

    @identifier id;

    @field code = '';

    @field name = '';

    @field address = '';

    @field phone_number;

    @field capacity;

    @field message_id;

    @field online_sales_halt_mins_before = 30;

    @field timezone = moment.tz.guess();

    @belongsTo({ model: Asset, inverseOf: 'owner' }) logo;

}
