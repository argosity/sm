import React from 'react';
import PropTypes    from 'prop-types';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import TicketIcon   from 'grommet/components/icons/base/Ticket';
import pluralize    from 'pluralize';
import Anchor       from 'grommet/components/Anchor';
import Box          from 'grommet/components/Box';
import Button       from 'grommet/components/Button';
import Paragraph    from 'grommet/components/Paragraph';

import PurchaseModel from '../../models/purchase';
import Layer from '../layer-wrapper';


@observer
export default class PurchaseReceipt extends React.PureComponent {

    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onPurchase: PropTypes.func.isRequired,
        purchase: PropTypes.instanceOf(PurchaseModel),
    }

    @computed get ticketName() {
        return pluralize('ticket', this.props.purchase.qty);
    }

    render() {
        const { purchase, purchase: { time: { show } } } = this.props;

        return (
            <Layer
                closer
                className="show-information"
                onClose={this.props.onCancel}
            >
                <Box
                    className="contents"
                    separator='horizontal'
                >
                    <h2>Thank you for purchasing tickets to {show.title}!</h2>
                    <Paragraph>
                        The transaction id for this order is {purchase.identifier}.  If you
                        need to contact us regarding the order, please mention this id so we
                        can find your records.
                    </Paragraph>
                    <Anchor
                        target="_blank"
                        href={purchase.tickets_url}
                        icon={<TicketIcon />}
                        primary={true}
                        align="center"
                        label={`Download and print ${this.ticketName}`}
                    />
                    <Paragraph size="large">
                        We’ve also emailed you a receipt with
                        the {this.ticketName} to {purchase.email}.
                    </Paragraph>
                    <h3>
                        See you at the show!
                    </h3>
                </Box>
                <Box
                    direction="row"
                    margin={{ vertical: 'small' }}
                    justify="end"
                    pad={{ between: 'small' }}
                >
                    <Button
                        label={'OK'}
                        onClick={this.props.onCancel}
                    />
                </Box>
            </Layer>
        );
    }

}
