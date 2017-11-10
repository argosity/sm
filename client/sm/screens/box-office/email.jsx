import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes   from 'prop-types';
import Layer       from 'grommet/components/Layer';
import TextInput   from 'grommet/components/TextInput';
import Button      from 'grommet/components/Button';
import SendIcon    from 'grommet/components/icons/base/Send';
import Footer      from 'grommet/components/Footer';
import Box         from 'grommet/components/Box';
import Spinning    from 'grommet/components/icons/Spinning';
import Sale        from '../../models/sale';

@observer
export default class Email extends React.PureComponent {

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
                <Footer
                    margin="medium"
                    justify="end"
                >
                    <Button
                        icon={<SendIcon />}
                        label='Send'
                        onClick={this.props.onComplete}
                    />
                </Footer>
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
                className="box-office-sale"
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
