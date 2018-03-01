import whenDomReady from 'hippo/lib/when-dom-ready';
import SmoothScroll from 'hippo/lib/smooth-scroll';

import fontawesome  from '@fortawesome/fontawesome';
import faRocket from '@fortawesome/fontawesome-free-solid/faRocket';
import faBullhorn from '@fortawesome/fontawesome-free-solid/faBullhorn';
import faTicketAlt from '@fortawesome/fontawesome-free-solid/faTicketAlt';
import faUsers from '@fortawesome/fontawesome-free-solid/faUsers';

import './homepage.scss';

// This enables using FontAwesome in CSS pseudo elements
// see: https://fontawesome.com/how-to-use/svg-with-js#pseudo-elements
fontawesome.config.searchPseudoElements = true;

// Icons should be imported individually to keep bundle size down
// import faPhone from '@fortawesome/fontawesome-pro-solid/faPhone';
fontawesome.library.add(faRocket, faBullhorn, faTicketAlt, faUsers);

// Execute SVG replacement
fontawesome.dom.i2svg();


whenDomReady(() => {
    document.querySelectorAll('.signup-link')
        .forEach(link => new SmoothScroll(link, '#signup'));
});
