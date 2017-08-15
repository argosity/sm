import Asset from 'hippo/models/asset';
import { observe } from 'mobx';
import { pick, isEmpty, uniqBy, map } from 'lodash';
import moment from 'moment';
import DateRange from 'hippo/lib/date-range';
import { toSentence, renameProperties } from 'hippo/lib/util';
import {
    BaseModel, identifiedBy, identifier, field, belongsTo, computed, hasMany,
} from './base';
import Occurrence from './event_occurrence';

@identifiedBy('sm/check-in')
export default class Event extends BaseModel {
