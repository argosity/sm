import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes   from 'prop-types';
import TextInput   from 'grommet/components/TextInput';
import Layer       from 'grommet/components/Layer';
import Button      from 'grommet/components/Button';
import MoneyIcon from 'grommet/components/icons/base/Money';
import Box         from 'grommet/components/Box';
import Spinning    from 'grommet/components/icons/Spinning';
import Sale        from '../../models/sale';

@observer
export default class Refund extends React.Component {

    static propTypes = {
        sale: PropTypes.instanceOf(Sale),
        onComplete: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    }

    @observable reason;

    @action.bound onChange(ev) {
        this.reason = ev.target.value;
    }

    @action.bound onComplete() {
        this.props.onComplete(this.reason);
    }

    renderControls() {
        return (
            <Box
                direction="column"
                pad={{ vertical: 'medium', between: 'small' }}
            >
                <label>
                    Refund Reason:
                </label>
                <TextInput min={1} onDOMChange={this.onChange} />
                <Button
                    icon={<MoneyIcon />}
                    label='Refund'
                    onClick={this.onComplete}
                />
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
                <h3>Refund Tickets</h3>
                <div className="name">{this.props.sale.name}</div>
                {this.renderBody()}
            </Layer>
        );
    }

}
