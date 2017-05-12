import Config from 'hippo/config';

import {
    BaseModel, identifiedBy, field, identifier, computed,
} from './base';


@identifiedBy('sm/brain-tree-config')
export default class BrainTreeConfig extends BaseModel {
    @identifier unused;

    @field merchant_id;
    @field public_key;
    @field private_key;

    @computed get syncUrl() {
        return `${Config.api_path}/sm/payments-config`;
    }
}
