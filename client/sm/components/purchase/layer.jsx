import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Box from 'grommet/components/Box';
import Layer from 'grommet/components/Layer';

import PurchaseForm from './form';

@observer
export default class PurchaseLayer extends React.PureComponent {
    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onComplete: PropTypes.func.isRequired,
    }

    render() {
        const { purchase, onCancel, onComplete } = this.props;
        if (!purchase) { return null; }

        return (
            <Layer
                closer
                onClose={onCancel}
                className="purchase"
            >
                <Box
                    flex
                    size={{ height: { min: 'medium' } }}
                    full="horizontal"
                    separator='horizontal'
                    className="purchase-pane"
                    pad={{ vertical: 'medium' }}
                >
                    <PurchaseForm
                        purchase={purchase}
                        onComplete={onComplete}
                    />
                </Box>
            </Layer>
        );
    }
}
