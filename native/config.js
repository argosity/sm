import { observable, computed } from 'mobx';
import { AsyncStorage } from 'react-native';
import Env from 'react-native-config';

class Config {

    @observable _tenant;
    @observable initialized = false;

    async initialize() {
        this._tenant = await AsyncStorage.getItem('tenant');
        this.initialized = true;
    }

    set tenant(value) {
        this._tenant = value;
        AsyncStorage.setItem('tenant', value);
    }

    @computed get tenant() {
        return this._tenant || this.env.TENANT;
    }

    @computed get url() {
        const domain = this.env.DOMAIN;
        const scheme = this.env.SCHEME;
        if (this.tenant) {
            return `${scheme}://${this.tenant}.${domain}/`;
        }
        return `${scheme}://${domain}/mobile`;
    }

    env = Env

}

const ConfigInstance = new Config;

ConfigInstance.initialize();

export default ConfigInstance;
