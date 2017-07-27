import React from 'react';  // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import Config from 'hippo/config';
import EmbeddedEvents from 'sm/models/embed/event';
import { AppContainer } from 'react-hot-loader';
import { when } from 'mobx';
import Listing from './listing';

let rootElement;
let eventsListing;

function render() {
    ReactDOM.render((
        <AppContainer>
            <Listing events={eventsListing} />
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
            rootElement.classList.remove('loading');
            EmbeddedEvents.fetch(data.embedId).then((c) => {
                eventsListing = c;
                render();
            });
        }
    )
}
