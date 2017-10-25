import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import Box from 'grommet/components/Box';
import ShowModel from 'sm/models/show';
import Footer from 'grommet/components/Footer';
import PageRenderer from 'hippo/components/text-editor/renderer';
import PurchaseButton from './purchase-button';
import Layer from '../layer-wrapper';

@observer
export default class Information extends React.PureComponent {

    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onPurchase: PropTypes.func.isRequired,
        show: PropTypes.instanceOf(ShowModel),
    }

    @action.bound
    onPurchase() {
        this.props.onPurchase(this.props.show);
    }

    render() {
        const { show } = this.props;
        if (!show) { return null; }

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
                    <PageRenderer className="body" content={show.page} />
                    <Footer
                        margin="small"
                        justify="end"
                        pad={{ horizontal: 'small', between: 'small' }}
                    >
                        <PurchaseButton
                            label="Purchase"
                            primary
                            show={show}
                            onClick={this.onPurchase}
                        />
                    </Footer>
                </Box>
            </Layer>
        );
    }

}
