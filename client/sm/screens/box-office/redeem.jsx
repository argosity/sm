import React from 'react';
import { get } from 'lodash';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import WarningNotification from 'hippo/components/warning-notification';
import PropTypes   from 'prop-types';
import Layer       from 'grommet/components/Layer';
import Input from 'grommet/components/Input';
import Button      from 'grommet/components/Button';
import { Save }    from 'grommet-icons';
import Footer      from 'grommet/components/Footer';
import Box         from 'grommet/components/Box';
import Spinning    from 'hippo/components/icon/spinning';
import Redemption  from '../../models/redemption';

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
            <Box pad="medium">
                <Input
                    type="number"
                    min={1}
                    onChange={this.onQtyChange}
                    max={redemption.maxQty}
                    defaultValue={redemption.maxQty}
                />
                <Footer
                    margin="medium"
                    justify="end"
                >
                    <Button
                        icon={<Save />}
                        label='Save'
                        onClick={this.onSaveClick}
                    />
                </Footer>
            </Box>
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
        const { redemption } = this.props;
        if (!redemption) { return null; }

        return (
            <Layer
                closer
                className="box-office"
                onClose={this.props.onCancel}
                pad={{ between: 'small' }} margin="medium"
            >
                <h3>Redeem Ticket</h3>
                <WarningNotification message={redemption.errorMessage} />
                <div className="name">{this.name}</div>
                {this.renderBody()}
            </Layer>
        );
    }

}
