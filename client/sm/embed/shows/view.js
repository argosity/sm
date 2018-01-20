import xhr from 'hippo/lib/xhr';

export default class View {

    constructor(embed) {
        this.embed = embed;
    }

    render({ response }) {
        this.embed.root.innerHTML = response;
    }

    display(id, success, failure) {
        const { host } = this.embed;
        let url = `${host}/api/sm/embed/shows/${this.embed.id}`;
        if (id) url += `/${id}`;
        xhr({ url }, { success, failure });
    }

    remove() { }

}
