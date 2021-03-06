import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { Send, Close } from 'grommet-icons';
import { Heading, Layer, TextInput, Button, Box } from 'grommet';
import PropTypes   from 'prop-types';
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
    onChange(ev) {
        this.props.sale.email = ev.target.value;
    }


    renderControls() {
        const { sale } = this.props;
        return (
            <Box>
                <TextInput
                    min={1}
                    autoFocus
                    type="email"
                    onChange={this.onChange}
                    defaultValue={sale.email}
                />
                <Box margin="medium" justify="end">
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
        return this.props.sale.sync.isBusy ? this.renderSpinner() : this.renderControls();
    }

    render() {
        const { sale, onCancel } = this.props;
        if (!sale) { return null; }

        return (
            <Layer onEsc={onCancel} className="box-office">
                <Box margin="medium">
                    <Box flex="grow" align="center" justify="between" direction="row">
                        <Heading level={4} margin="none">Email Ticket</Heading>
                        <Button plain icon={<Close />} onClick={onCancel} />
                    </Box>
                    <div className="name">{sale.name}</div>
                    {this.renderBody()}
                </Box>
            </Layer>
        );
    }

}
