import React from 'react';
import PropTypes from 'prop-types';
import { action, computed } from 'mobx';
import { sumBy } from 'lodash';
import cn from 'classnames';
import moment from 'moment';
import Button from 'grommet/components/Button';
import { Done, Mail, Ticket, Trash, Ticket } from 'grommet-icons';
import MobileApp from '../../lib/mobile-app-support';
import Sale from '../../models/sale';
import UX from './ux';

// note this does not use pure componenent
// it needs to udpate when the row has redemptions added
export default class Guest extends React.Component {

    static propTypes = {
        rowIndex: PropTypes.number.isRequired,
        ux: PropTypes.instanceOf(UX).isRequired,
    }

    @action.bound onRedeem() {
        this.props.ux.onRedeem(this.props.rowIndex);
    }
    @action.bound onMail() {
        this.props.ux.onMail(this.props.rowIndex);
    }
    @action.bound onRefund() {
        this.props.ux.onRefund(this.props.rowIndex);
    }
    @computed get printURL() {
        return Sale.ticketUrlForIdentifier(this.props.row[UX.FIELDS.IDENTIFIER]);
    }

    renderPrintBtn() {
        if (MobileApp.isReal) { return null; }
        return (
            <Button
                href={this.printURL} target="_blank"
                plain icon={<Ticket />}
            />
        );
    }


    render() {
        const { style, row } = this.props;
        const redeemed = sumBy(row[UX.FIELDS.REDEMPTIONS], 'qty');
        const is_voided = row[UX.FIELDS.IS_VOIDED];
        const full = (0 === (row[UX.FIELDS.QTY] - redeemed));
        const doneIcon = full ? <DoneIcon size="small" /> : null;

        return (
            <div
                className={cn('guest', { full, is_voided })}
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
                    <Button onClick={this.onMail} plain icon={<Mail />} />
                    {this.renderPrintBtn()}
                    <Button onClick={this.onRefund} plain icon={<TrashIcon />} />
                </div>
            </div>
        );
    }

}
