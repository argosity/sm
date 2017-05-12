import { get } from 'lodash';
import { computed } from 'mobx';
import Config from 'hippo/config';
import {
    EmbeddedBaseModel, session, identifiedBy,
} from './model';

@identifiedBy('sm/embedded/venue')
export default class Asset extends EmbeddedBaseModel {
    @session({ type: 'object' }) file_data;

    @computed get baseUrl() {
        return Config.api_host + Config.api_path + Config.assets_path_prefix;
    }

    urlFor(type = 'original') {
        const url = get(this, `file_data.${type}.id`);
        return url ? `${this.baseUrl}/${url}` : null;
    }
}
