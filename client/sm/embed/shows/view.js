import xhr from 'hippo/lib/xhr';

export default class View {

    constructor(embed) {
        this.embed = embed;
    }

    get root() {
        return this.embed.root;
    }

    render({ response }) {
        this.embed.root.innerHTML = response;
        this.updateStyleVariables();
    }

    display(id, success, failure) {
        const { host } = this.embed;
        let url = `${host}/api/sm/embed/shows/${this.embed.id}`;
        if (id) url += `/${id}`;
        xhr({ url }, { success, failure });
    }

    remove() { }

    updateStyleVariables() {
        const styles = this.root.querySelector('[data-type="css-style-variables"]');
        if (!styles) { return; }
        const rules = JSON.parse(styles.innerHTML);
        Object.keys(rules).forEach((key) => {
            this.root.style.setProperty(`--sm-${key}`, rules[key]);
        });
    }

}
