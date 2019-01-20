import { action, observable, computed } from 'mobx';
import { get } from 'lodash';
import Query from 'hippo/models/query';
import PubSub from 'hippo/models/pub_sub';
import WindowSize from 'hippo/lib/window-size';
import Sale from '../../models/sale';
import Redemption from '../../models/redemption';
import MobileApp from '../../lib/mobile-app-support';

export default class GuestUX {

    static FIELDS = {
        ID:          0,
        TIME_ID:     1,
        IDENTIFIER:  2,
        NAME:        3,
        PHONE:       4,
        EMAIL:       5,
        QTY:         6,
        DATE:        7,
        REDEMPTIONS: 8,
        IS_VOIDED:   9,
    }

    get fields() {
        return this.constructor.FIELDS;
    }

    @observable time;

    // = new ShowTime();
    @observable redemption;

    @observable emailSale;

    @observable refundSale;

    windowSize = new WindowSize();

    query = new Query({
        src: Sale,
        syncOptions: { with: ['with_details'], order: { created_at: 'desc' } },
        fields: [
            { id: 'id', queryable: false, dataType: 'number' },
            { id: 'show_time_id', queryable: false, dataType: 'number' },
            { id: 'identifier', label: 'Order #' },
            'name', 'phone', 'email', 'qty', 'created_at',
            'redemptions', 'is_voided',
        ],
    })

    @computed get rowHeight() {
        return 55 * Math.ceil((150 * 6) / this.windowSize.width);
    }

    addSale(sale) {
        this.query.results.insertRow({ model: sale });
    }

    @action
    onUnmount() {
        this.pubSubUnsubscribe();
    }

    @computed get qtySold() {
        return get(this.query.results, 'metaData.qty_sold', 0);
    }

    @computed get qtyRedeemed() {
        return get(this.query.results, 'metaData.qty_redeemed', 0);
    }

    pubSubUnsubscribe() {
        if (!this.time) { return; }
        PubSub.channel.unsubscribe(
            `/show/redemption/${this.time.id}`,
            this.onRedemption,
        );
    }

    update({ time }) {
        if (time.isNew || time === this.time) { return; }

        this.query.autoFetch = true;
        this.query.clauses.replace([
            {
                field: this.query.fields[this.fields.TIME_ID],
                visible: false,
                value: time.id,
                operator: this.query.fields[this.fields.ID].preferredOperator,
            },
            { field: this.query.fields[this.fields.NAME], value: '' },
        ]);
        this.pubSubUnsubscribe();
        PubSub.channel.subscribe(`/show/redemption/${time.id}`, this.onRedemption);
        this.time = time;
    }

    @action.bound
    cancelPending() {
        this.emailSale = null;
        this.redemption = null;
        this.refundSale = null;
    }

    @action.bound
    onRedemption(data) {
        this.query.rows.forEach((r) => {
            if (r[this.fields.ID] === data.sale_id) {
                r[this.fields.REDEMPTIONS].push(data);
                this.query.results.rowUpdateCount += 1;
            }
        });
    }

    @action.bound
    onRedeem(rowIndex) {
        this.redemption = new Redemption({
            rowIndex,
            sale: this.query.results.modelForRow(rowIndex),
        });
    }

    @action.bound
    onCheckInComplete() {
        if (this.redemption.errorMessage) {
            MobileApp.playSound('fail');
        } else {
            MobileApp.playSound('beep');
            this.redemption = null;
        }
    }

    @action.bound
    onRefundConfirm(reason, void_only) {
        this.refundSale.refund(reason, void_only).then(() => {
            this.refundSale = null;
        });
    }

    @action checkInTicket(ticket) {
        this.redemption = Redemption.fromTicket(ticket);
        const saleRow = this.query.rows.find(
            r => this.redemption.ticketIdentifier === r[this.fields.IDENTIFIER],
        );
        if (saleRow) {
            this.redemption.sale = this.query.results.convertRowToObject(saleRow);
        }
        this.redemption.sync.save().then(this.onCheckInComplete);
    }

    @action onRefund(rowIndex) {
        this.refundSale = this.query.results.modelForRow(rowIndex);
    }

    @action onMail(rowIndex) {
        this.emailSale = this.query.results.modelForRow(rowIndex);
    }

    @action.bound
    onMailSend() {
        this.emailSale.emailReceipt().then(() => {
            this.emailSale = null;
        });
    }

}
