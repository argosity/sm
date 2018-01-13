import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import Config from 'hippo/config';
import 'hippo/config-data';
// import { AppContainer } from 'react-hot-loader';
import { when } from 'mobx';
import Listing from './root';
// import Tenant from 'hippo/models/tenant';
// import Shows from '../../models/show';

// let rootElement;
// let showsListing;
//
// function render() {
//     ReactDOM.render((
//         <AppContainer>
//             <Listing shows={showsListing} />
//         </AppContainer>
//     ), rootElement);
// }
//
// if (module.hot) {
//     module.hot.accept('./listing', () => {
//         const nextListing = require('./listing').default; // eslint-disable-line global-require
//         render(nextListing);
//     });
// }

export default function boot({ host, data, root }) {
    when(
        () => Config.isIntialized,
        () => {
            Config.bootSettings = data;
            Config.api_host = host;
            Listing.bootstrap(data.embedId).then((listing) => {
                root.classList.remove('loading');
                ReactDOM.render(<Listing shows={listing} />, root);
            });
        },
    );
}
