import View from './view';

export default class Purchase extends View {

    display(id) {
        this.embed.root.innerHTML = '<div class="loading">Loading…</div>';
        System.import('./purchase-form').then(({ default: PurchaseForm }) => {
            this.embed.root.innerHTML = '';
            PurchaseForm.boot(id, this.embed);
        });
    }

}
