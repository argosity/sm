import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { find, sumBy } from 'lodash';
import { action, observable } from 'mobx';
import cn from 'classnames';
import moment from 'moment';
import { Row, Col } from 'react-flexbox-grid';
import { autobind } from 'core-decorators';
import Query from 'hippo/models/query';
import DataList from 'hippo/components/data-list';
import Box from 'grommet/components/Box';
import QueryBuilder from 'hippo/components/query-builder';
import Sale from '../../models/sale';
import Occurrence from '../../models/event_occurrence';
import Redemption from '../../models/redemption';
import Redeem from './redeem';
import DoneIcon from 'grommet/components/icons/base/Compliance';

const ID          = 0,
      PURCHASE_ID = 1,
      IDENTIFIER  = 2, // eslint-disable-line
      NAME        = 3,
      PHONE       = 4,
      EMAIL       = 5,
      QTY         = 6,
      DATE        = 7, // eslint-disable-line
      REDEMPTIONS = 8;

function Attendee({ style, onClick, row }) {
    const redeemed = sumBy(row[REDEMPTIONS], 'qty');
    const full = ((row[QTY] - redeemed) <= 0);
    const doneIcon = full ? <DoneIcon size="medium" /> : null;
    return (
        <Row
            onClick={full ? null : onClick}
            style={style} className={cn('attendee', { full })}
        >
            <Col sm={9} xs={11}>
                <Row>
                    <Col sm={6} xs={12}>
                        <Row>
                            <Col sm={7} xs={12}>
                                <Row>
                                    <Col xs={7} sm={12}>
                                        <h4>{row[NAME]}</h4>
                                    </Col>
                                    <Col xs={5} sm={12}>
                                        {row[IDENTIFIER]}
                                    </Col>
                                </Row>
                            </Col>

                            <Col sm={5} xs={12}>
                                <Row>
                                    <Col sm={12} xs={8}>
                                        Redeemed/Sold
                                    </Col>
                                    <Col sm={12} xs={4}>
                                        <b>{redeemed}</b> / <b>{row[QTY]}</b>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>

                    <Col sm={6} xs={12}>
                        <Row>
                            <Col xs={6} sm={12}>
                                {row[PHONE]}
                            </Col>
                            <Col xs={6} sm={12}>
                                {row[EMAIL]}
                            </Col>
                        </Row>

                    </Col>
                </Row>
            </Col>
            <Col sm={2} xs={11}>
                {moment(row[DATE]).format('dd, MMM Do, h:mm:ss a')}
            </Col>
            <Col xs={1} className="icon">
                {doneIcon}
            </Col>
        </Row>
    );
}

@observer
export default class Attendees extends React.PureComponent {

    static propTypes = {
        occurrence: PropTypes.instanceOf(Occurrence).isRequired,
    }

    @observable rowHeight;
    @observable redemption;
    query = new Query({
        src: Occurrence,
        syncOptions: { with: ['sales'], order: { occurs_at: 'desc' } },
        fields: [
            { id: 'id', queryable: false, dataType: 'number' },
            { id: 'purchase_id', queryable: false, dataType: 'number' },
            { id: 'purchase_identifier', label: 'Order #' },
            'name', 'phone', 'email', 'qty', 'created_at', 'redemptions',
        ],
    })


    constructor(props) {
        super(props);
        this.setQuery(props);
        this.mql = window.matchMedia('(min-width: 800px)');
        this.mql.addListener(this.onMediaQueryChanged);
        this.onMediaQueryChanged();
    }

    componentWillUnmount() {
        this.mql.removeListener(this.onMediaQueryChanged);
    }

    @action.bound
    onMediaQueryChanged() {
        this.rowHeight = this.mql.matches ? 70 : 120;
    }

    setQuery(props) {
        this.query.clauses.replace([
            {
                field: this.query.fields[ID],
                visible: false,
                value: props.occurrence.id,
                operator: this.query.fields[ID].preferredOperator,
            },
            { field: this.query.fields[NAME], value: '' },
        ]);
    }

    componentWillReceiveProps(props) {
        if (!props.occurrence.isNew && props.occurrence !== this.props.occurrence) {
            this.setQuery(props);
            this.query.autoFetch = true;
        } else {
            this.query.autoFetch = false;
            this.query.reset();
        }
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

    @action.bound
    onCheckInComplete() {
        if (!this.redemption.isNew) {
            this.query.results.rows[
                this.redemption.rowIndex
            ][REDEMPTIONS].push({
                qty: this.redemption.qty, created_at: (new Date()).toISOString(),
            });
            this.query.results.rowUpdateCount += 1;
        }
        this.redemption = null;
    }

    render() {
        const { query, props: { occurrence } } = this;
        if (occurrence.isNew) { return null; }

        return (
            <Box
                className={'attendees'}
                align='stretch' direction='column'
                pad={{ between: 'medium' }}
                margin={{ vertical: 'medium' }}
                flex
            >
                <Redeem redemption={this.redemption} onComplete={this.onCheckInComplete} />
                <QueryBuilder autoFetch={true} query={query} />
                <DataList
                    onRowClick={this.onRecordSelect}
                    query={query}
                    rowComponent={Attendee}
                    rowHeight={this.rowHeight}
                />
            </Box>
        );
    }
}
