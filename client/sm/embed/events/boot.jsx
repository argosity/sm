import React from 'react';  // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import Config from 'lanes/config';
import EventModel from 'sm/models/event';
import { AppContainer } from 'react-hot-loader';

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
    Config.bootSettings = data;
    Config.api_host = host;
    rootElement = root;
    rootElement.classList.remove('loading');
    eventsListing = EventModel.Collection.create();
    eventsListing.fetch({
        url: `${Config.api_path}/sm/public/events`,
        with: 'with_details',
    }).then(() => render());
}
