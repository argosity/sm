import {
    EmbeddedBaseModel, session, belongsTo, identifiedBy,
} from './model';
import Asset from './asset';

@identifiedBy('sm/embedded/presenter')
export default class EmbeddedPresenter extends EmbeddedBaseModel {
    @session name;
    @belongsTo({ model: Asset }) logo;
}
