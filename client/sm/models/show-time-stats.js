import moment from 'moment-timezone';
import Big from 'big.js';
import {
    BaseModel, identifiedBy, field, identifier, belongsTo, computed, session,
} from './base';

@identifiedBy('sm/show-time/stats')
export default class ShowTimeStats extends BaseModel {


    @identifier id;

    @session redemptions;

    @session sales;

    @session({ type: 'object' }) timeline;



}
