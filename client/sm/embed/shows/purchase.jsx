import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action, observable, computed } from 'mobx';
import { map } from 'lodash';
import Box       from 'grommet/components/Box';
import Heading   from 'grommet/components/Heading';
import Button    from 'grommet/components/Button';
import FormField from 'grommet/components/FormField';
import Select    from 'grommet/components/Select';

import { FormState } from 'hippo/components/form';
import NetworkActivityOverlay from 'hippo/components/network-activity-overlay';
import WarningNotification from 'hippo/components/warning-notification';

import PurchaseModel from '../../models/purchase';
import ShowModel from '../../models/show';
import PurchaseForm from '../../components/purchase/form';

import Layer from '../layer-wrapper';
import Image from './image';

@observer
export default class Purchase extends React.PureComponent {
    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onPurchaseComplete: PropTypes.func.isRequired,
        purchase: PropTypes.instanceOf(PurchaseModel).isRequired,
        show: PropTypes.instanceOf(ShowModel).isRequired,
    }

    @observable isTokenizing = false;

    formState = new FormState();


    @computed get timeOptions() {
        return map(this.props.show.futureTimes, o => ({
            time: o,
            label: (
                <Box key={o.identifier} direction='row' justify='between' responsive={false}>
                    <span>{o.formattedOccursAt}</span>
                    <span>{o.formattedPrice}</span>
                </Box>
            ),
        }));
    }

    @action.bound
    onTimeChange({ value: { time } }) {
        this.props.purchase.time = time;
    }

    @action.bound
    onComplete() {
        this.props.onPurchaseComplete(this.props.purchase);
    }

    @action.bound
    setFormRef(form) { this.form = form; }

    renderTimes() {
        return (
            <FormField label='Show'>
                <Select
                    className="times"
                    value={
                        this.props.purchase.time ?
                            this.props.purchase.time.formattedOccursAt : ''
                    }
                    onChange={this.onTimeChange}
                    options={this.timeOptions}
                />
            </FormField>
        );
    }

    render() {
        const { props: { purchase, show, onCancel } } = this;

        return (
            <Layer
                className="show-purchase"
                onClose={onCancel}
                closer
            >
                <Box
                    className="order-pane"
                    separator='horizontal'
                    full="horizontal"
                    size="full"
                    pad={{ vertical: 'medium' }}
                    basis="xxlarge"
                    flex
                >
                    <NetworkActivityOverlay
                        message={purchase.activityMessage}
                        visible={this.isTokenizing}
                        model={purchase}
                    />
                    <WarningNotification message={purchase.errorMessage} />
                    <div className="top-info">
                        <Image image={show.image} size="thumbnail" />
                        <div className="description">
                            <Heading>{show.title}</Heading>
                            <h3 className="sub-title">{show.sub_title}</h3>
                            <p className="description">{show.description}</p>
                        </div>
                    </div>
                    <PurchaseForm
                        purchase={purchase}
                        onComplete={this.onComplete}
                        ref={this.setFormRef}
                        heading={this.renderTimes()}
                        controls={
                            <Button label="Cancel" onClick={onCancel} accent />
                        }
                    >
                    </PurchaseForm>
                </Box>
            </Layer>
        );
    }
}
