import React from 'react';
import { get } from 'lodash';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes   from 'prop-types';
import styled from 'styled-components';
import { Box, Layer, TextInput, Button, Heading } from 'grommet';
import { Save, Close } from 'grommet-icons';
import Spinning from 'hippo/components/icon/spinning';
import WarningNotification from 'hippo/components/warning-notification';
import Redemption  from '../../models/redemption';

const Controls = styled.div`
display: flex;
flex-direction: column;
> * { margin-top: 1rem; }
input { width: 100%; }
`;

@observer
export default class Redeem extends React.Component {

    static propTypes = {
        redemption: PropTypes.instanceOf(Redemption),
        onComplete: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    }

    @action.bound
    onQtyChange(ev) {
        this.props.redemption.qty = ev.target.value;
    }

    @action.bound
    onSaveClick() {
        this.props.redemption.save().then(this.props.onComplete);
    }

    renderControls() {
        const { redemption } = this.props;
        return (
            <Controls>
                <TextInput
                    min={1}
                    autoFocus
                    size="large"
                    type="number"
                    onChange={this.onQtyChange}
                    max={redemption.maxQty}
                    defaultValue={redemption.maxQty}
                />
                <Button
                    icon={<Save />}
                    label='Save'
                    onClick={this.onSaveClick}
                />
            </Controls>
        );
    }

    renderSpinner() {
        return <Box pad="medium"><Spinning size="medium" /></Box>;
    }

    renderBody() {
        return this.props.redemption.syncInProgress ? this.renderSpinner() : this.renderControls();
    }

    get redemption() {
        return this.props.redemption;
    }

    get name() {
        const { redemption } = this.props;
        if (!redemption) { return null; }
        return get(redemption, 'sale.name', redemption.ticket);
    }

    render() {
        const { redemption, onCancel } = this.props;
        if (!redemption) { return null; }

        return (
            <Layer className="box-office" onEsc={onCancel}>
                <Box margin="medium">
                    <Box flex="grow" align="center" justify="between" direction="row">
                        <Heading level={4} margin="none">Redeem Ticket</Heading>
                        <Button plain icon={<Close />} onClick={onCancel} />
                    </Box>
                    <WarningNotification message={redemption.errorMessage} />
                    <div className="name">{this.name}</div>
                    {this.renderBody()}
                </Box>
            </Layer>
        );
    }

}
