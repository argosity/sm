import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes   from 'prop-types';
import TextInput   from 'grommet/components/TextInput';
import Layer       from 'grommet/components/Layer';
import Button      from 'grommet/components/Button';
import CheckBox    from 'grommet/components/CheckBox';
import { Money }   from 'grommet-icons';
import Box         from 'grommet/components/Box';
import Spinning    from 'hippo/components/icon/spinning';
import Sale        from '../../models/sale';

@observer
export default class Refund extends React.Component {

    static propTypes = {
        sale: PropTypes.instanceOf(Sale),
        onComplete: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    }

    @observable reason;
    @observable void_only;

    @action.bound onTextChange(ev) {
        this.reason = ev.target.value;
    }

    @action.bound onCheckChange(ev) {
        this.void_only = ev.target.checked;
    }

    @action.bound onComplete() {
        this.props.onComplete(this.reason, this.void_only);
    }

    renderControls() {
        return (
            <Box
                direction="column"
                pad={{ vertical: 'medium', between: 'small' }}
            >
                <CheckBox label='Void only' onChange={this.onCheckChange} />
                <label>
                    Refund Reason:
                </label>
                <TextInput min={1} onDOMChange={this.onTextChange} />
                <Button
                    icon={<Money />}
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
