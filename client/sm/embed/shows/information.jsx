import React from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { computed, action } from 'mobx';
import Box from 'grommet/components/Box';
import Footer from 'grommet/components/Footer';
import PageRenderer from 'hippo/components/text-editor/renderer';
import Layer from '../layer-wrapper';
import PurchaseButton from './purchase-button';

@observer
export default class Information extends React.Component {

    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onPurchase: PropTypes.func.isRequired,
        identifier: PropTypes.string.isRequired,
        shows: MobxPropTypes.observableArray,
    }

    @action.bound
    onPurchase() {
        this.props.onPurchase(this.props.show);
    }

    @computed get show() {
        return this.props.shows.find(s => s.identifier === this.props.identifier);
    }

    render() {
        const { show } = this;
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
