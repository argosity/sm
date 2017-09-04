import Bootstrap from 'hippo/lib/bootstrap';

import './loading.scss';

const bootstrap = new Bootstrap({
    srcTag: /\/assets\/embedded-shows\.js/,
});

bootstrap.onReady((host, data) => {
    let root = document.querySelector(data.renderTo);
    if (!root) {
        console.warn(`Didn't find element for selector ${bootstrap.tagData.renderTo}, creating at end of document`); // eslint-disable-line no-console
        root = document.createElement('div');
        document.body.appendChild(root);
    }
    root.classList.add('shows-listing');
    root.classList.add('loading');
    root.innerHTML = (
        '<div class="banner">Loading Shows<div class="left"></div><div class="right"></div></div>'
    );
    System.import('./shows/boot.jsx').then(({ default: boot }) => {
        boot({ host, data, root });
    });
});
