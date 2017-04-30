import whenDomReady from 'when-dom-ready';
import SmoothScroll from 'lanes/lib/smooth-scroll';
import './homepage.scss';

whenDomReady(() => {
    document.querySelectorAll('.signup-link')
        .forEach(link => new SmoothScroll(link, '#signup'));
});
