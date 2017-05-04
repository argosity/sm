import {
    EmbeddedBaseModel, session, belongsTo, identifiedBy,
} from './model';

import Asset from './asset';

@identifiedBy('sm/embedded/venue')
export default class EmbeddedPresenter extends EmbeddedBaseModel {

    @session name;
    @session address;
    @session phone_number;

    @belongsTo({ model: Asset }) logo;

}
