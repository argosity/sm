import { pick } from 'lodash';
import {
    BaseModel, identifiedBy, identifier, field, session, belongsTo,
} from './base';

@identifiedBy('sm/redemption')
export default class Redemption extends BaseModel {

    @identifier id;

    @field qty = 0;

    @field sale_id;

    @field ticket;

    @field({ type: 'date' }) created_at;

    @session sale;

    @session rowIndex;

    @belongsTo({ model: 'sm/sale' }) sale;

    constructor(attrs) {
        super(attrs);
        if (this.sale) {
            this.sale_id = this.sale.id;
            this.qty = this.maxQty;
        }
    }

    static fromTicket(ticket) {
        return new Redemption({ qty: 1, ticket });
    }

    get ticketIdentifier() {
        return this.ticket ? this.ticket.split(':')[0] : '';
    }

    get maxQty() {
        return this.sale ? this.sale.remainingQty : 1;
    }

    set syncData(s) {
        this.update(s);
    }

    get syncData() {
        return pick(this, 'qty', 'sale_id', 'ticket');
    }

}
