import Bootstrap from 'hippo/lib/bootstrap';
import Embed from './shows/embed';
import './shows.scss';

const bootstrap = new Bootstrap({
    srcTag: /\/assets\/embedded-shows\.js/,
});

bootstrap.onReady((host, data) => {
    let root = document.querySelector(data.renderTo);
    if (!root) {
        // eslint-disable-next-line no-console
        console.warn(`Didn't find element for selector ${bootstrap.tagData.renderTo}, creating at end of document`);
        root = document.createElement('div');
        document.body.appendChild(root);
    }
    root.classList.add('showmaker-embedded-shows');
    Embed.boot(root, host, data);
});
