import { action, observable } from 'mobx';
import Query from 'hippo/models/query';
import PubSub from 'hippo/models/pub_sub';
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
        IS_REFUNDED: 9,
    }

    get fields() {
        return this.constructor.FIELDS;
    }

    @observable time;
    @observable rowHeight;
    @observable redemption;
    @observable emailSale;
    @observable refundSale;

    query = new Query({
        src: Sale,
        syncOptions: { with: ['with_details'], order: { created_at: 'desc' } },
        fields: [
            { id: 'id', queryable: false, dataType: 'number' },
            { id: 'show_time_id', queryable: false, dataType: 'number' },
            { id: 'identifier', label: 'Order #' },
            'name', 'phone', 'email', 'qty', 'created_at',
            'redemptions', 'is_refunded',
        ],
    })

    constructor(props) {
        this.update(props);
        if (window.matchMedia) {
            this.mql = window.matchMedia('(min-width: 800px)');
            this.mql.addListener(this.onMediaQueryChanged);
            this.onMediaQueryChanged();
        }
    }

    addSale(sale) {
        this.query.results.insertRow({ model: sale });
    }

    @action
    onUnmount() {
        this.mql.removeListener(this.onMediaQueryChanged);
        this.pubSubUnsubscribe();
    }

    @action.bound
    onMediaQueryChanged() {
        this.rowHeight = this.mql.matches ? 70 : 120;
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
    onRefundConfirm(reason) {
        this.refundSale.refund(reason).then(() => {
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
        this.redemption.save().then(this.onCheckInComplete);
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
