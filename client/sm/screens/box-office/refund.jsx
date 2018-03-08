import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Box, Heading, TextInput, Layer, Button, CheckBox } from 'grommet';
import { Money, Close } from 'grommet-icons';
import Spinning from 'hippo/components/icon/spinning';
import Sale from '../../models/sale';

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
                gap="small"
                direction="column"
                pad={{ vertical: 'medium', between: 'small' }}
            >
                <CheckBox label='Void only' onChange={this.onCheckChange} />
                <label>
                    Refund Reason:
                </label>
                <TextInput min={1} onInput={this.onTextChange} />
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
        const { sale, onCancel } = this.props;
        if (!sale) { return null; }

        return (
            <Layer onEsc={onCancel} className="box-office">
                <Box margin="medium">
                    <Box flex="grow" align="center" justify="between" direction="row">
                        <Heading level={4} margin="none">Refund Ticket</Heading>
                        <Button plain icon={<Close />} onClick={onCancel} />
                    </Box>
                    <div className="name">{this.props.sale.name}</div>
                    {this.renderBody()}
                </Box>
            </Layer>
        );
    }

}
