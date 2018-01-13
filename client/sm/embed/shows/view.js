import xhr from 'hippo/lib/xhr';

export default class View {

    constructor(router) {
        this.router = router;
    }

    render({ response }) {
        this.router.root.innerHTML = response;
    }

    fetch(url, success, failure) {
        xhr({ url }, { success, failure });
    }

    remove() { }

}
