// This is the client-side version of SM::Extension
import React from 'react';
import {
    BaseExtension, identifiedBy, identifier,
} from 'lanes/extensions/base';

import SystemSettings from './components/settings';

@identifiedBy('extensions/sh')
export default class SMExtension extends BaseExtension {

    // must match the server-side identier in config/screens.rb
    // and lib/sm/extension.rb
    @identifier id = 'sh';

    // This method is called when the extension is registered
    // Not all of Lanes will be available yet
    onRegistered() { }

    // This method is called after Lanes is completly loaded
    // and all extensions are registered
    onInitialized() { }

    // All extenensions have been given their data and Lanes has completed startup
    onAvailable() { }

    // Data that is provided by SM::Extension#client_bootstrap_data
    // in lib/sm/extension.rb is passed to this method
    // the Base class will simply store the provided data as @data
    setBootstrapData(...args) { return super.setBootstrapData(...args); }

    get systemSettingsComponent() {
        return SystemSettings;
    }
}
