import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes   from 'prop-types';
import Layer       from 'grommet/components/Layer';
import NumberInput from 'grommet/components/NumberInput';
import Button      from 'grommet/components/Button';
import SaveIcon    from 'grommet/components/icons/base/Save';
import Footer      from 'grommet/components/Footer';
import Box         from 'grommet/components/Box';
import Spinning    from 'grommet/components/icons/Spinning';
import Redemption  from '../../models/redemption';

@observer
export default class Redeem extends React.PureComponent {

    static propTypes = {
        redemption: PropTypes.instanceOf(Redemption),
        onComplete: PropTypes.func.isRequired,
    }

    @observable redemption = new Redemption();

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
            <Box>
                <NumberInput
                    min={1}
                    onChange={this.onQtyChange}
                    max={redemption.maxQty}
                    defaultValue={redemption.maxQty}
                />
                <Footer
                    margin="medium"
                    justify='between'
                >
                    <Button
                        icon={<SaveIcon />}
                        label='Save'
                        onClick={this.onSaveClick}
                    />
                </Footer>
            </Box>
        );
    }

    renderSpinner() {
        return <Spinning size="medium" />;
    }

    renderBody() {
        return this.props.redemption.syncInProgress ? this.renderSpinner() : this.renderControls();
    }

    render() {
        if (!this.props.redemption) { return null; }

        return (
            <Layer
                closer
                className="box-office-redemption"
                onClose={this.props.onComplete}
                pad={{ between: 'small' }} margin="medium"
            >

                <h3>Redeem Ticket</h3>
                <div className="name">{this.props.redemption.sale.name}</div>
                {this.renderBody()}
            </Layer>
        );
    }
}
