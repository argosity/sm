import {
    BaseModel, identifiedBy, identifier,  session,
} from './base';

@identifiedBy('sm/show-time/stats')
export default class ShowTimeStats extends BaseModel {

    @identifier id;
    @session redemptions;
    @session sales;
    @session({ type: 'object' }) timeline;

}
