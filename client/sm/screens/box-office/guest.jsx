import React from 'react';
import PropTypes from 'prop-types';
import { action, computed } from 'mobx';
import { sumBy } from 'lodash';
import cn from 'classnames';
import moment from 'moment';
import Button from 'grommet/components/Button';
import DoneIcon from 'grommet/components/icons/base/Compliance';
import MailIcon from 'grommet/components/icons/base/Mail';
import TicketIcon   from 'grommet/components/icons/base/Ticket';
import Sale from '../../models/sale';
import UX from './ux';

// note this does not use pure componenent
// it needs to udpate when the row has redemptions added
export default class Guest extends React.Component {

    static propTypes = {
        rowIndex: PropTypes.number.isRequired,
    }

    @action.bound onRedeem() {
        this.props.ux.onRedeem(this.props.rowIndex);
    }
    @action.bound onMail() {
        this.props.ux.onMail(this.props.rowIndex);
    }

    @computed get printURL() {
        return Sale.ticketUrlForIdentifier(this.props.row[UX.FIELDS.IDENTIFIER]);
    }

    render() {
        const { style, row } = this.props;
        const redeemed = sumBy(row[UX.FIELDS.REDEMPTIONS], 'qty');
        const full = (0 === (row[UX.FIELDS.QTY] - redeemed));
        const doneIcon = full ? <DoneIcon size="xsmall" /> : null;
        return (
            <div
                className={cn('guest', { full })}
                style={style}
            >
                <div
                    className="grid"
                    onClick={full ? null : this.onRedeem}
                >
                    <div className="name">{doneIcon}{row[UX.FIELDS.NAME]}</div>
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
                <div className="controls">
                    <Button onClick={this.onMail} plain icon={<MailIcon />} />
                    <Button href={this.printURL} target="_blank" plain icon={<TicketIcon />} />
                </div>
            </div>
        );
    }

}
