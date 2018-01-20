import View from './view';

export default class Order extends View {

    display(id) {
        this.embed.root.innerHTML = `
            <div class="order-receipt">
                <h1>Thank you for your order!</h1>
                    <p>
                        The transaction ID for this order is ${id}.  If you
                        need to contact us regarding the order, please mention this
                        ID so we can find the order in our records.
                    </p>
                    <p>
                       We've also emailed you a receipt.  If you don't want to print the tickets, simply show us the email on your smartphone and we can scan that.
                    </p>
                    <p>See you at the show!</p>
                    <div class="actions">
                        <a
                          target="_blank"
                          class="btn btn-primary"
                          href="${this.embed.host}/api/print/tickets/${id}.pdf"
                            >
                            Download and print ticket
                        </a>
                            <a
                              class="btn btn-default"
                              href="#listing"
                            >
                                Return to listing
                            </a>

                    </div>
            </div>
        `;
    }

}
