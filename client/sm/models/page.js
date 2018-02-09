import Asset from 'hippo/models/asset';
import { computed, toJS } from 'mobx';
import {
    BaseModel, identifiedBy, identifier, field, hasMany,
} from './base';

@identifiedBy('sm/page')
export default class Page extends BaseModel {

    @identifier id;

    @field html = '';
    @field({ type: 'object' }) contents;
    @field({ type: 'object' }) owner;
    @field owner_id;
    @field owner_type;

    @hasMany({ model: Asset, inverseOf: 'owner' }) images;

    @computed get editorContent() {
        return toJS(this.contents);
    }

}
