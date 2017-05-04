import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Box        from 'grommet/components/Box';
import EventModel from 'sm/models/event';
import Footer from 'grommet/components/Footer';
import PurchaseButton from './purchase-button';

import Layer from '../layer-wrapper';

@observer
export default class Information extends React.PureComponent {
    static propTypes = {
        onComplete: PropTypes.func.isRequired,
        onPurchase: PropTypes.func.isRequired,
        event: PropTypes.instanceOf(EventModel),
    }

    render() {
        const { event } = this.props;
        if (!event) { return null; }

        return (
            <Layer
                closer
                className="event-information"
                onClose={this.props.onComplete}
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
                        <PurchaseButton
                            label="Purchase"
                            primary
                            event={event}
                            onClick={this.props.onPurchase}
                        />
                    </Footer>
                </Box>
            </Layer>
        );
    }
}
