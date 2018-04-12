import React from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Box } from 'grommet';
import DataList from 'hippo/components/data-list';
import QueryBuilder from 'hippo/components/query-builder';
import Redeem from './redeem';
import Email from './email';
import Refund from './refund';
import Guest from './guest';
import UX from './ux';

@observer
export default class GuestList extends React.Component {

    static propTypes = {
        ux: PropTypes.instanceOf(UX).isRequired,
    }

    @autobind renderGuest(props) {
        const row = this.props.ux.query.results.rows[props.index];
        return (
            <Guest
                {...props}
                rowIndex={props.index}
                row={row}
                ux={this.props.ux}
            />
        );
    }

    render() {
        const { ux } = this.props;
        if (!ux.time) { return null; }

        return (
            <Box
                className={'guest-list'}
                align='stretch' direction='column'
                pad={{ between: 'small' }}
                flex
            >
                <Redeem
                    redemption={ux.redemption}
                    onComplete={ux.onCheckInComplete}
                    onCancel={ux.cancelPending}
                />
                <Email
                    sale={ux.emailSale}
                    onComplete={ux.onMailSend}
                    onCancel={ux.cancelPending}
                />
                <Refund
                    sale={ux.refundSale}
                    onComplete={ux.onRefundConfirm}
                    onCancel={ux.cancelPending}
                />
                <QueryBuilder autoFetch={true} query={ux.query} />
                <DataList
                    query={ux.query}
                    rowRenderer={this.renderGuest}
                    rowHeight={ux.rowHeight}
                />
            </Box>
        );
    }

}
