import { action, observable } from 'mobx';
import Query from 'hippo/models/query';
import PubSub from 'hippo/models/pub_sub';
import Sale from '../../models/sale';
import Redemption from '../../models/redemption';
import ShowTime from '../../models/show-time';

export default class AttendeeUX {

    static FIELDS = {
        ID:          0,
        PURCHASE_ID: 1,
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

    @observable rowHeight;
    @observable redemption;

    query = new Query({
        src: ShowTime,
        syncOptions: { with: ['sales'], order: { occurs_at: 'desc' } },
        fields: [
            { id: 'id', queryable: false, dataType: 'number' },
            { id: 'purchase_id', queryable: false, dataType: 'number' },
            { id: 'purchase_identifier', label: 'Order #' },
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
        if (this.time.isNew) { return; }
        PubSub.channel.unsubscribe(
            `/show/redemption/${this.props.time.id}`,
            this.onRedemption,
        );
    }

    update(props) {
        if (!props.time.isNew && props.time !== this.time) {
            this.query.autoFetch = true;
            this.query.clauses.replace([
                {
                    field: this.query.fields[this.fields.ID],
                    visible: false,
                    value: props.time.id,
                    operator: this.query.fields[this.fields.ID].preferredOperator,
                },
                { field: this.query.fields[this.fields.NAME], value: '' },
            ]);
            this.pubSubUnsubscribe();
            PubSub.channel.subscribe(`/show/redemption/${props.time.id}`, this.onRedemption);
        } else {
            this.query.autoFetch = false;
            this.query.reset();
        }
        this.time = props.time;
    }

    @action.bound
    onRedemption(data) {
        this.query.rows.forEach((r) => {
            if (r[this.fields.PURCHASE_ID] === data.purchase_id) {
                r[this.fields.REDEMPTIONS].push(data);
                this.query.results.rowUpdateCount += 1;
            }
        });
    }

    @action.bound
    onRecordSelect(rowIndex) {
        this.redemption = new Redemption({
            rowIndex,
            sale: new Sale(
                this.query.results.rowAsObject(rowIndex),
            ),
        });
    }

}
