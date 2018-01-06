import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { Send }    from 'grommet-icons';
import PropTypes   from 'prop-types';
import Layer       from 'grommet/components/Layer';
import TextInput   from 'grommet/components/TextInput';
import Button      from 'grommet/components/Button';
import Box         from 'grommet/components/Box';
import Spinning    from 'hippo/components/icon/spinning';
import Sale        from '../../models/sale';

@observer
export default class Email extends React.Component {

    static propTypes = {
        sale: PropTypes.instanceOf(Sale),
        onComplete: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    }

    @action.bound
    onQtyChange(ev) {
        this.props.sale.email = ev.target.value;
    }


    renderControls() {
        const { sale } = this.props;
        return (
            <Box>
                <TextInput
                    min={1}
                    onChange={this.onChange}
                    defaultValue={sale.email}
                />
                <Box
                    margin="medium"
                    justify="end"
                >
                    <Button
                        icon={<Send />}
                        label='Send'
                        onClick={this.props.onComplete}
                    />
                </Box>
            </Box>
        );
    }

    renderSpinner() {
        return <Box pad="medium"><Spinning size="medium" /></Box>;
    }

    renderBody() {
        return this.props.sale.syncInProgress ? this.renderSpinner() : this.renderControls();
    }

    render() {
        if (!this.props.sale) { return null; }

        return (
            <Layer
                closer
                className="box-office"
                onClose={this.props.onCancel}
                pad={{ between: 'small' }} margin="medium"
            >
                <h3>Email Receipt</h3>
                <div className="name">{this.props.sale.name}</div>
                {this.renderBody()}
            </Layer>
        );
    }

}
