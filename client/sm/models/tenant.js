import {
    BaseModel, identifiedBy, field, identifier, computed,
} from './base';

let CACHE;

@identifiedBy('sm/tenant')
export default class Tenant extends BaseModel {

    @identifier id;
    @field slug;
    @field name;

    @computed get url() {
        return `https://${this.slug}.showmaker.com`;
    }

    static get current() {
        if (!CACHE) {
            CACHE = new Tenant();
            CACHE.fetch({ query: 'current' });
        }
        return CACHE;
    }
}
