import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Box from 'grommet/components/Box';
import Layer from 'grommet/components/Layer';

import SaleForm from './form';

@observer
export default class SaleLayer extends React.Component {

    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onComplete: PropTypes.func.isRequired,
    }

    render() {
        const { sale, onCancel, onComplete } = this.props;
        if (!sale) { return null; }

        return (
            <Layer
                onEsc={onCancel}
                className="sale"
            >
                <Box
                    flex
                    size={{ height: { min: 'medium' } }}
                    separator='horizontal'
                    className="sale-pane"
                    margin="small"
                >
                    <SaleForm
                        sale={sale}
                        onComplete={onComplete}
                    />
                </Box>
            </Layer>
        );
    }

}
