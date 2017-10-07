import Config from 'hippo/config';

import {
    BaseModel, identifiedBy, field, identifier, computed,
} from './base';


@identifiedBy('sm/brain-tree-config')
export default class SquareConfig extends BaseModel {

    @identifier unused;

    @field authorization;
    @field location_id;

    @computed get isAuthorized() {
        return Boolean(this.authorization);
    }

    @computed get syncUrl() {
        return `${Config.api_path}/sm/payments-config`;
    }

}
