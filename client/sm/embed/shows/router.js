import xhr from 'hippo/lib/xhr';

import DefaultView from './view';


const VIEWS = {

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
        this.incomingView = new (VIEWS[view] || DefaultView)(this.root);
        const url = `${this.url}/${view}.html`;
        xhr({ url }, { success: this.updatePage, failure: this.onFailure });
    }

    updatePage = (reply) => {
        this.failCount = 0;
        this.view.remove();
        this.view = this.incomingView;
        this.view.render(reply.response);
    }

    onFailure = (req) => {
        // eslint-disable-next-line no-console
        console.warn(req);
        this.view.render('<p class="error">request failed</p>');
    }

}
