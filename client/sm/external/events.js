import Bootstrap from 'lanes/lib/bootstrap';

import './loading.scss';

const bootstrap = new Bootstrap({
    srcTag: /\/events\.js/,
});

bootstrap.onReady((host, data) => {
    let root = document.getElementById(data.renderToId);
    if (!root) {
        console.warn(`Didn't find element for selector ${bootstrap.tagData.renderToId}, creating at end of document`); // eslint-disable-line no-console
        root = document.createElement('div');
        document.body.appendChild(root);
    }
    root.classList.add('events-listing');
    root.classList.add('loading');
    root.innerHTML = (
        '<div class="banner">Loading Events<div class="left"></div><div class="right"></div></div>'
    );
    System.import('./events/boot.jsx').then(({ default: boot }) => {
        boot({ host, data, root });
    });
});
