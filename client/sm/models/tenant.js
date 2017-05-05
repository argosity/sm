import {
    BaseModel, identifiedBy, field, identifier, computed,
} from './base';
import { get } from 'lodash';
import { observable } from 'mobx';

const CACHE = observable({
    Tenant: undefined,
});

@identifiedBy('sm/tenant')
export default class Tenant extends BaseModel {

    @identifier id;
    @field slug = get(window, 'location.hostname', '').split('.')[0];
    @field name;

    @computed get url() {
        return `https://${this.slug}.showmaker.com`;
    }

    @computed static get current() {
        if (!CACHE.Tenant) {
            CACHE.Tenant = new Tenant();
            CACHE.Tenant.fetch({ query: 'current' });
        }
        return CACHE.Tenant;
    }
}
