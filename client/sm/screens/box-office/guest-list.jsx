import React from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Box from 'grommet/components/Box';
import DataList from 'hippo/components/data-list';
import QueryBuilder from 'hippo/components/query-builder';
import ShowTime from '../../models/show-time';
import Redeem from './redeem';
import Email from './email';
import Refund from './refund';
import Guest from './guest';
import UX from './ux';

@observer
export default class GuestList extends React.Component {

    static propTypes = {
        time: PropTypes.instanceOf(ShowTime).isRequired,
    }

    ux = new UX(this.props);

    componentWillUnmount() {
        this.ux.onUnmount();
    }

    componentWillReceiveProps(props) {
        this.ux.update(props);
    }

    @autobind renderGuest(props) {
        const row = this.ux.query.results.rows[props.index];
        return (
            <Guest
                {...props}
                rowIndex={props.index}
                row={row}
                ux={this.ux}
            />
        );
    }

    render() {
        if (!this.ux.time) { return null; }

        return (
            <Box
                className={'guest-list'}
                align='stretch' direction='column'
                pad={{ between: 'small' }}
                flex
            >
                <Redeem
                    redemption={this.ux.redemption}
                    onComplete={this.ux.onCheckInComplete}
                    onCancel={this.ux.cancelPending}
                />
                <Email
                    sale={this.ux.emailSale}
                    onComplete={this.ux.onMailSend}
                    onCancel={this.ux.cancelPending}
                />
                <Refund
                    sale={this.ux.refundSale}
                    onComplete={this.ux.onRefundConfirm}
                    onCancel={this.ux.cancelPending}
                />
                <QueryBuilder autoFetch={true} query={this.ux.query} />
                <DataList
                    query={this.ux.query}
                    rowRenderer={this.renderGuest}
                    rowHeight={this.ux.rowHeight}
                />
            </Box>
        );
    }

}
