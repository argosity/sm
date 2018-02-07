import whenDomReady from 'hippo/lib/when-dom-ready';
import SmoothScroll from 'hippo/lib/smooth-scroll';
import './homepage.scss';

whenDomReady(() => {
    document.querySelectorAll('.signup-link')
        .forEach(link => new SmoothScroll(link, '#signup'));
});
