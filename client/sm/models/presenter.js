import Asset from 'hippo/models/asset';
import {
    CachedModel, identifiedBy, identifier, belongsTo, field,
} from './base';

@identifiedBy('sm/presenter')
export default class Presenter extends CachedModel {

    @identifier id;

    @field code = '';
    @field name = '';

    @belongsTo({ model: Asset, inverseOf: 'owner' }) logo;

}
