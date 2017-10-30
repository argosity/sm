import { observable, computed } from 'mobx';
import { AsyncStorage } from 'react-native';

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
        return this._tenant;
    }

}

const ConfigInstance = new Config;

ConfigInstance.initialize();

export default ConfigInstance;
