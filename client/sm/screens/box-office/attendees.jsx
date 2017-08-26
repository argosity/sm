import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { sumBy } from 'lodash';
import { action, observable } from 'mobx';
import cn from 'classnames';
import moment from 'moment';
import Box from 'grommet/components/Box';
import DoneIcon from 'grommet/components/icons/base/Compliance';
import DataList from 'hippo/components/data-list';
import QueryBuilder from 'hippo/components/query-builder';
import Occurrence from '../../models/event-occurrence';
import Redeem from './redeem';

import UX from './attendee-ux';

function Attendee({ style, onClick, row }) {
    const redeemed = sumBy(row[UX.FIELDS.REDEMPTIONS], 'qty');
    const full = (0 === (row[UX.FIELDS.QTY] - redeemed));
    const doneIcon = full ? <DoneIcon size="medium" /> : null;
    return (
        <div
            className={cn('attendee', { full })}
            onClick={full ? null : onClick}
            style={style}
        >
            <div className="grid">
                <div className="name">{row[UX.FIELDS.NAME]}</div>
                <div className="ident">{row[UX.FIELDS.IDENTIFIER]}</div>
                <div className="rs">
                    Purchased: <b>{row[UX.FIELDS.QTY]}</b>; Redeemed: <b>{redeemed}</b>
                </div>
                <div className="phone">{row[UX.FIELDS.PHONE]}</div>
                <div className="email">{row[UX.FIELDS.EMAIL]}</div>
                <div className="date">{
                    moment(row[UX.FIELDS.DATE]).format('dd, MMM Do, h:mm:ss a')
                }</div>
            </div>
            <div className="icon">{doneIcon}</div>
        </div>
    );
}

@observer
export default class Attendees extends React.PureComponent {
    static propTypes = {
        occurrence: PropTypes.instanceOf(Occurrence).isRequired,
    }

    ux = new UX(this.props);

    componentWillUnmount() {
        this.ux.onUnmount();
    }

    componentWillReceiveProps(props) {
        this.ux.update(props);
    }

    render() {
        if (this.ux.occurrence.isNew) { return null; }

        return (
            <Box
                className={'attendees'}
                align='stretch' direction='column'
                pad={{ between: 'medium' }}
                margin={{ vertical: 'medium' }}
                flex
            >
                <Redeem redemption={this.ux.redemption} onComplete={this.ux.onCheckInComplete} />
                <QueryBuilder autoFetch={true} query={this.ux.query} />
                <DataList
                    onRowClick={this.ux.onRecordSelect}
                    query={this.ux.query}
                    rowComponent={Attendee}
                    rowHeight={this.ux.rowHeight}
                />
            </Box>
        );
    }
}
