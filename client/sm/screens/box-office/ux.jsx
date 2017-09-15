import { action, observable } from 'mobx';
import Query from 'hippo/models/query';
import PubSub from 'hippo/models/pub_sub';
import Sale from '../../models/sale';
import Redemption from '../../models/redemption';

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
    }

    get fields() {
        return this.constructor.FIELDS;
    }

    @observable time;
    @observable rowHeight;
    @observable redemption;
    @observable emailSale;

    query = new Query({
        src: Sale,
        syncOptions: { with: ['with_details'], order: { created_at: 'desc' } },
        fields: [
            { id: 'id', queryable: false, dataType: 'number' },
            { id: 'show_time_id', queryable: false, dataType: 'number' },
            { id: 'identifier', label: 'Order #' },
            'name', 'phone', 'email', 'qty', 'created_at', 'redemptions',
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


    @action.bound
    onCheckInComplete() {
        this.redemption = null;
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

        //   this.query.autoFetch = false;
        //   this.query.reset();
    // }
    }

    @action.bound
    cancelPending() {
        this.emailSale = null;
        this.redemption = null;
    }

    @action.bound
    onRedemption(data) {
        this.query.rows.forEach((r) => {
            if (r[this.fields.TIME_ID] === data.sale_id) {
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
    onMail(rowIndex) {
        this.emailSale = this.query.resuls.modelForRow(rowIndex);
    }
    @action.bound
    onMailSend() {
        this.emailSale.emailReceipt().then(() => {
            this.emailSale = null;
        });
    }

}
