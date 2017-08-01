import Event from 'sm/models/event';

import {
    BaseModel, identifiedBy, session, belongsTo,
} from 'hippo/models/base';
import { observable } from 'mobx';

@identifiedBy('sm/native/check-in')
export default class EventCheckIn extends BaseModel {


    @belongsTo({ model: Event }) event;

    @observable foo;
}
