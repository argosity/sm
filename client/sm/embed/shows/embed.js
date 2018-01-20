import DefaultView from './view';
import purchase from './purchase';
import listing from './listing';
import info from './info';
import order from './order';

const VIEWS = {
    purchase,
    listing,
    info,
    order,
};


export default class Embed {

    static boot(...args) {
        if (window.ShowMaker) {
            root.innerHTML = '<h1>Only a single instance of ShowMaker can be loaded at once</h1>';
        }
        window.ShowMaker = new Embed(...args);
    }

    constructor(root, host, data) {
        this.id = data.embedId;
        this.root = root;
        this.host = host;
        this.data = data;
        this.view = new DefaultView(this.root);
        window.addEventListener('hashchange', this.onHashChange);
        this.onHashChange();
    }

    onHashChange = () => {
        // eslint-disable-next-line no-restricted-globals
        const hash = location.hash || '#';
        const [view, id] = 1 === hash.length ? ['listing'] : hash.slice(1).split('/');
        this.incomingView = new (VIEWS[view] || DefaultView)(this);
        this.incomingView.display(id, this.updatePage, this.onFailure);
    }

    updatePage = (reply) => {
        this.failCount = 0;
        this.view.remove();
        this.view = this.incomingView;
        this.view.render(reply);
    }

    onFailure = (req) => {
        // eslint-disable-next-line no-console
        console.warn(req);
        this.view.render('<p class="error">request failed</p>');
    }

}
