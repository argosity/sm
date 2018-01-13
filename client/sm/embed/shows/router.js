import DefaultView from './view';
import purchase from './purchase';

const VIEWS = {
    purchase,
};


export default class Router {

    static boot(...args) {
        if (window.ShowMaker) {
            root.innerHTML = '<h1>Only a single instance of ShowMaker can be loaded at once</h1>';
        }
        window.ShowMaker = new Router(...args);
    }

    constructor(root, host, data) {
        this.root = root;
        this.host = host;
        this.url = `${this.host}/api/sm/embed/shows/${data.embedId}`;
        this.view = new DefaultView(this.root);
        window.addEventListener('hashchange', this.onHashChange);
        this.onHashChange();
    }

    onHashChange = () => {
        // eslint-disable-next-line no-restricted-globals
        const hash = location.hash || '#';
        const view = 1 === hash.length ? 'listing' : hash.slice(1);
        this.incomingView = new (VIEWS[view] || DefaultView)(this);
        this.incomingView.fetch(`${this.url}/${view}.html`, this.updatePage, this.onFailure);
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
