import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import Config from 'hippo/config';
import 'hippo/config-data';
import Tenant from 'hippo/models/tenant';
import { AppContainer } from 'react-hot-loader';
import { when } from 'mobx';
import Listing from './listing';
import Shows from '../../models/show';

let rootElement;
let showsListing;

function render() {
    ReactDOM.render((
        <AppContainer>
            <Listing shows={showsListing} />
        </AppContainer>
    ), rootElement);
}

if (module.hot) {
    module.hot.accept('./listing', () => {
        const nextListing = require('./listing').default; // eslint-disable-line global-require
        render(nextListing);
    });
}

export default function boot({ host, data, root }) {
    when(
        () => Config.isIntialized,
        () => {
            Config.bootSettings = data;
            Config.api_host = host;
            rootElement = root;
            Promise.all([
                Shows.fetchEmbedded(data.embedId), Tenant.current.fetch(),
            ]).then((promises) => {
                rootElement.classList.remove('loading');
                [showsListing] = promises;
                render();
            });
        },
    );
}
