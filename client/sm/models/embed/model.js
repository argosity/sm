import { BaseModel as LanesBaseModel } from 'lanes/models/base';

export {
    identifiedBy, belongsTo, hasMany,
    action, autorun, field, session, identifier, observable, computed,
} from 'lanes/models/base';

import {
    isEmpty,
} from 'lodash';

import Collection from 'lanes/models/collection';

export class EmbeddedBaseModel {

    constructor(attrs) {
        if (!isEmpty(attrs)) { this.update(attrs); }
    }

    static get Collection() {
        return this.$collection || (this.$collection = new Collection(this));
    }

}
