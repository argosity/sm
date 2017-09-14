import React from 'react';
import PropTypes from 'prop-types';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { sumBy } from 'lodash';
import cn from 'classnames';
import moment from 'moment';
import Button from 'grommet/components/Button';
import DoneIcon from 'grommet/components/icons/base/Compliance';
import MailIcon from 'grommet/components/icons/base/Mail';
import UX from './ux';

@observer
export default class Guest extends React.PureComponent {

    static propTypes = {
        rowIndex: PropTypes.number.isRequired,
    }

    @action.bound onRedeem() {
        this.props.ux.onRedeem(this.props.rowIndex);
    }
    @action.bound onMail() {
        this.props.ux.onMail(this.props.rowIndex);
    }

    render() {
        const { style, row } = this.props;
        const redeemed = sumBy(row[UX.FIELDS.REDEMPTIONS], 'qty');
        const full = (0 === (row[UX.FIELDS.QTY] - redeemed));
        const doneIcon = full ? <DoneIcon size="medium" /> : null;
        return (
            <div
                className={cn('guest', { full })}
                style={style}
            >
                <div
                    className="grid"
                    onClick={full ? null : this.onRedeem}
                >
                    <div className="name">{row[UX.FIELDS.NAME]}{doneIcon}</div>
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
                </div>
            </div>
        );
    }
}
