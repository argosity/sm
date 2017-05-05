import { BaseModel as LanesBaseModel } from 'lanes/models/base';

export {
    identifiedBy, belongsTo, hasMany,
    action, autorun, field, session, identifier, observable, computed,
} from 'lanes/models/base';


export class EmbeddedBaseModel extends LanesBaseModel {


}
