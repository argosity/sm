import {
    BaseModel, identifiedBy, identifier, field, session, belongsTo,
} from './base';

@identifiedBy('sm/redemption')
export default class Redemption extends BaseModel {

    @identifier id;

    @field qty = 0;
    @field sale_id;
    @field({ type: 'date' }) created_at;
    @session sale;
    @session rowIndex;

    @belongsTo({ model: 'sm/sale' }) sale;

    constructor(attrs) {
        super(attrs);
        if (this.sale) {
            this.sale_id = this.sale.sale_id;
            this.qty = this.maxQty;
        }
    }

    get maxQty() {
        return this.sale.remainingQty;
    }

}
