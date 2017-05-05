import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action, observable, computed } from 'mobx';
import { findKey, each, delay, mapValues } from 'lodash';
import { Row, Col } from 'react-flexbox-grid';
import Box from 'grommet/components/Box';

import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import CreditCardIcon from 'grommet/components/icons/base/CreditCard';

import NetworkActivityOverlay from 'lanes/components/network-activity-overlay';
import WarningNotification from 'lanes/components/warning-notification';

import PurchaseModel from '../../models/embed/purchase';
import EventModel from '../../models/embed/event';

import Layer from '../layer-wrapper';

import Image from './image';

import PurchaseForm from './purchase-form';

@observer
export default class Purchase extends React.PureComponent {

    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onPurchaseComplete: PropTypes.func.isRequired,
        purchase: PropTypes.instanceOf(PurchaseModel).isRequired,
        event: PropTypes.instanceOf(EventModel).isRequired,
    }

    @observable formSaver; // getBTToken;
    @observable isValid = true // false;

    @observable isTokenizing = false;

    @action.bound
    onPurchase() {
        const { event, purchase } = this.props;
        purchase.errors = null;
        this.isTokenizing = true;
        this.formSaver({ purchase, event }).then(() => {
            this.isTokenizing = false;
            if (purchase.isValid) {
                purchase.save().then(() => {
                    if (purchase.isValid()) {
                        this.props.onPurchaseComplete();
                    }
                });
            }
        }).catch((err) => {
            purchase.errors = { invalid: err.message }; // eslint-disable-line
            this.isTokenizing = false;
        });
    }

    @action.bound
    onBTError(err) {
        this.props.purchase.errors = {
            card: err.message,
        };
    }

    @action.bound
    onValidityChange(isValid) {
        // if (isValid !== this.isValid) { this.isValid = isValid; }
    }

    render() {
        const { props: { purchase, event, onCancel } } = this;

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
                    basis="xlarge"
                    flex
                >
                    <NetworkActivityOverlay
                        message={purchase.errorMessage || 'Purchasing…'}
                        visible={this.isTokenizing}
                        model={purchase}
                    />
                    <WarningNotification message={purchase.errorMessage} />
                    <Row>
                        <Image xs={3} sm={2}  md={1} image={event.image} size="thumbnail" />
                        <Col   xs={9} sm={10} md={11}>
                            <h3>{event.title}</h3>
                            <h4>{event.sub_title}</h4>
                        </Col>
                    </Row>

                    <PurchaseForm
                        setSave={form => this.formSaver = form}
                        event={event}
                        onValidityChange={this.onValidityChange}
                        purchase={purchase}
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
                        onClick={this.isValid ? this.onPurchase : null}
                    />
                </Footer>
            </Layer>
        );
    }
}
