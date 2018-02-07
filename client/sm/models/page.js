import Asset from 'hippo/models/asset';
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

}
