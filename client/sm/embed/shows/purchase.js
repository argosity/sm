import View from './view';

export default class Purchase extends View {

    display(id) {
        this.embed.root.innerHTML = `
            <div class="saving">
                <span class="message">
                    <span class="sm-embed-spinner"></span> Loading…
                </span>
            </div>
        `;
        // eslint-disable-next-line
        System.import('./purchase-form').then(({ default: PurchaseForm }) => {
            this.embed.root.innerHTML = '';
            PurchaseForm.boot(id, this.embed);
        });
    }

}
