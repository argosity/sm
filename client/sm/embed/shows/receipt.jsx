import React from 'react';
import PropTypes    from 'prop-types';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { Ticket }   from 'grommet-icons';
import pluralize    from 'pluralize';
import Anchor       from 'grommet/components/Anchor';
import Box          from 'grommet/components/Box';
import Button       from 'grommet/components/Button';
import Paragraph    from 'grommet/components/Paragraph';

import Sale from '../../models/sale';

@observer
export default class Receipt extends React.Component {

    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        identifier: PropTypes.string.isRequired,
        lastSale: PropTypes.instanceOf(Sale),
    }

    @computed get ticketName() {
        return this.props.lastSale ? pluralize('ticket', this.props.lastSale.qty) : 'ticket';
    }

    @computed get show() {
        return this.props.lastSale ? this.props.lastSale.show : null;
    }

    @computed get title() {
        const { show } = this;
        if (!show) { return null; }

        return <h2>Thank you for purchasing tickets to {show.title}!</h2>;
    }

    @computed get emailMessage() {
        const { sale } = this.props;
        if (!sale) { return null; }

        return (
            <Paragraph size="large">
                We’ve also emailed you a receipt with
                the {this.ticketName} to {sale.email}.
            </Paragraph>
        );
    }

    render() {
        const { identifier } = this.props;

        return (
            <div className="show-receipt">
                <Box
                    className="contents"
                    separator='horizontal'
                >
                    {this.title}
                    <Paragraph>
                        The transaction id for this order is {identifier}.  If you
                        need to contact us regarding the order, please mention this id so we
                        can find your records.
                    </Paragraph>
                    <Anchor
                        target="_blank"
                        href={Sale.ticketUrlForIdentifier(identifier)}
                        icon={<Ticket />}
                        primary={true}
                        align="center"
                        label={`Download and print ${this.ticketName}`}
                    />
                    {this.emailMessage}
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
            </div>
        );
    }

}
