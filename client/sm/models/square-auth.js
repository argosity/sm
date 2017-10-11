import {
    BaseModel, identifiedBy, field, identifier, computed,
} from './base';


@identifiedBy('sm/square-auth')
export default class SquareAuth extends BaseModel {

    @identifier id = 'linked';

    @field token;
    @field location_id;
    @field location_name;

    @computed get isAuthorized() {
        return Boolean(this.location_id);
    }

}
