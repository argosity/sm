/** @jsx Preact.h */
import Preact from 'preact';
import View from './view';

export default class Purchase extends View {

    fetch(url) {
        System.import('./purchase-form').then(({ default: PurchaseForm }) => {
            Preact.render(<PurchaseForm url={this.router.url} />, this.router.root);
        });
    }

}
