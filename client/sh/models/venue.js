import {
    BaseModel, identifiedBy, identifier, belongsTo, hasMany, field, computed
} from './base';

import { intercept } from 'mobx';
import { toUpper } from 'lodash';

function upperCaseOnChange(change) {
    change.newValue = toUpper(change.newValue);
    return change;
}

@identifiedBy('sh/venue')
export default class Venue extends BaseModel {

    @identifier id;

    @field code = '';

    @field name = '';
    @field address = '';
    @field phone_number;

    @belongsTo({ model: 'lanes/asset', inverseOf: 'owner' }) logo;

    constructor(attrs) {
        super(attrs);
        intercept(this, 'code', upperCaseOnChange);
    }
}
