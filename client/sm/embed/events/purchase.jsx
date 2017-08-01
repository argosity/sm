import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action, observable, computed } from 'mobx';
import { findKey, each, delay, mapValues } from 'lodash';
import { Row, Col } from 'react-flexbox-grid';
import Box from 'grommet/components/Box';

import Heading        from 'grommet/components/Heading';
import Footer         from 'grommet/components/Footer';
import Button         from 'grommet/components/Button';
import CreditCardIcon from 'grommet/components/icons/base/CreditCard';

import NetworkActivityOverlay from 'hippo/components/network-activity-overlay';
import WarningNotification from 'hippo/components/warning-notification';

import PurchaseModel from '../../models/embed/purchase';
import EventModel from '../../models/embed/event';

import Layer from '../layer-wrapper';

import Image from './image';
import { FormState } from 'hippo/components/form';
import PurchaseForm from './purchase-form';

@observer
export default class Purchase extends React.PureComponent {

    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onPurchaseComplete: PropTypes.func.isRequired,
        purchase: PropTypes.instanceOf(PurchaseModel).isRequired,
        event: PropTypes.instanceOf(EventModel).isRequired,
    }

    @observable isTokenizing = false;

    formState = new FormState();

    @action.bound
    onPurchase() {
        if (!this.form.isValid) {
            this.form.exposeErrors();
            return;
        }
        const { purchase } = this.props;
        purchase.errors = null;
        this.isTokenizing = true;
        this.form.saveState().then(() => {
            this.isTokenizing = false;
            if (purchase.isValid) {
                purchase.save().then(() => {
                    if (purchase.isValid) {
                        this.props.onPurchaseComplete();
                    }
                });
            }
        }).catch((err) => {
            purchase.errors = { invalid: err.message }; // eslint-disable-line
            this.isTokenizing = false;
        });
    }


    render() {
        const { formState, props: { purchase, event, onCancel } } = this;

        return (
            <Layer
                className="event-purchase"
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
                        message={purchase.errorMessage || 'Purchasing…'}
                        visible={this.isTokenizing}
                        model={purchase}
                    />
                    <WarningNotification message={purchase.errorMessage} />
                    <div className="top-info">
                        <Image image={event.image} size="thumbnail" />
                        <div className="description">
                            <Heading>{event.title}</Heading>
                            <h3 className="sub-title">{event.sub_title}</h3>
                            <p className="description">{event.description}</p>
                        </div>
                    </div>
                    <PurchaseForm
                        event={event}
                        purchase={purchase}
                        formState={formState}
                        ref={form => this.form = form}
                    />
                </Box>
                <Footer
                    margin="small"
                    justify="end"
                    pad={{ horizontal: 'small', between: 'small' }}
                >
                    <Button label="Cancel" onClick={onCancel} accent />
                    <Button
                        primary
                        icon={<CreditCardIcon />}
                        label='Purchase'
                        onClick={this.onPurchase}
                    />
                </Footer>
            </Layer>
        );
    }
}
