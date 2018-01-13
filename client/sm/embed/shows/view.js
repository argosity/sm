export default class View {

    constructor(root) {
        this.root = root;
    }

    render(html) {
        this.root.innerHTML = html;
    }

    remove() { }

}
