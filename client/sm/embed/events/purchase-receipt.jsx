import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action } from 'mobx';

import Box        from 'grommet/components/Box';
import Footer from 'grommet/components/Footer';
import PurchaseButton from './purchase-button';

import PurchaseModel from '../../models/embed/purchase';

import Layer from '../layer-wrapper';

@observer
export default class PurchaseReceipt extends React.PureComponent {
    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onPurchase: PropTypes.func.isRequired,
        purchase: PropTypes.instanceOf(PurchaseModel),
    }

    @action.bound
    onPurchase() {
        this.props.onPurchase(this.props.event);
    }

    render() {
        const { event } = this.props;
        if (!event) { return null; }

        return (
            <Layer
                closer
                className="event-information"
                onClose={this.props.onCancel}
            >
                <Box
                    className="contents"
                    separator='horizontal'
                    full="horizontal"
                    size="full"
                    basis="xxlarge"
                >
                    <h1>{event.title}</h1>
                    <div
                        className="body"
                        dangerouslySetInnerHTML={{ __html: event.page_html }}
                    />
                    <Footer
                        margin="small"
                        justify="end"
                        pad={{ horizontal: 'small', between: 'small' }}
                    >
                        <Button
                            label={'OK'}
                            onClick={this.props.onCancel}
                        />
                    </Footer>
                </Box>
            </Layer>
        );
    }
}
