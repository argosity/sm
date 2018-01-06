// This is the client-side version of SM::Extension

import Rollbar from 'rollbar';
import {
    BaseExtension, identifiedBy, identifier,
} from 'hippo/extensions/base';
import Extensions from 'hippo/extensions';
import Tenant from 'hippo/models/tenant';
import MobileApp from './lib/mobile-app-support';
import SystemSettings from './components/settings';
import AboutShowMaker from './components/about-show-maker';

@identifiedBy('extensions/sm')
export default class SMExtension extends BaseExtension {

    // must match the server-side identier in config/screens.rb
    // and lib/sm/extension.rb
    @identifier id = 'sm';

    // This method is called when the extension is registered
    // Not all of Hippo will be available yet
    onRegistered() { }

    // This method is called after Hippo is completly loaded
    // and all extensions are registered
    onInitialized() { }

    // All extenensions have been given their data and Hippo has completed startup
    onAvailable() {
        MobileApp.onReady(Tenant.current.slug);
    }

    // Data that is provided by SM::Extension#client_bootstrap_data
    // in lib/sm/extension.rb is passed to this method
    // the Base class will simply store the provided data as @data
    setBootstrapData(data, config) {
        if (config.environment !== 'development' && data.rollbar) {
            this.rollbar = new Rollbar(data.rollbar);
            this.rollbar.configure({
                captureUncaught: true,
                payload: {
                    tenant: Tenant.subdomain,
                },
            });
        }
        return super.setBootstrapData(data);
    }

    get systemSettingsComponent() {
        return SystemSettings;
    }

    rootView() {
        return AboutShowMaker;
    }

    static get paymentsVendor() {
        return Extensions.get('sm').data.payments.vendor;
    }

}
