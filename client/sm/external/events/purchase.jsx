import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action, observable, computed } from 'mobx';
import { findKey, each, delay, mapValues } from 'lodash';
import { Row, Col } from 'react-flexbox-grid';
import Box        from 'grommet/components/Box';
import EventModel from 'sm/models/event';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import Value from 'grommet/components/Value';
import CreditCardIcon from 'grommet/components/icons/base/CreditCard';
import FormField from 'lanes/components/form-field';
import { addFormFieldValidations, nonBlank, stringValue, validEmail, numberValue } from 'lanes/lib/forms';
import { sprintf } from 'sprintf-js';
import { Braintree } from 'react-braintree-fields';

import PurchaseModel from '../../models/purchase';
import Layer from '../layer-wrapper';
import NetworkActivityOverlay from 'lanes/components/network-activity-overlay';
import WarningNotification from 'lanes/components/warning-notification';
import CardField from './card-field';
import Image from './image';

@observer
class Purchase extends React.PureComponent {
    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        purchase: PropTypes.instanceOf(PurchaseModel).isRequired,
        event: PropTypes.instanceOf(EventModel).isRequired,
    }

    static formFields = {
        qty: numberValue,
        name: nonBlank,
        email: validEmail,
        phone: stringValue,
    }

    @observable focused;
    @observable getBTToken;
    @observable cardIsValid = false;
    @observable isTokenizing = false;

    componentWillMount() {
        this.props.setDefaultValues(this.props.purchase);
    }

    componentDidMount() {
        if (this.nameFieldRef) { this.nameFieldRef.focus(); }
    }

    @action.bound
    onPurchase() {
        const { event, purchase, fields } = this.props;
        this.isTokenizing = true;
        this.getBTToken().then(({ nonce, details: { cardType: card_type, lastTwo: digits } }) => {
            purchase.update(mapValues(fields, 'value'));
            purchase.event_id = event.id;
            purchase.payments = [{ nonce, card_type, digits }];
            this.isTokenizing = false;
            purchase.save().then(() => {
                debugger
            });
        }).catch((err) => {
            purchase.errors = { credit_card: err.message };
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
    onValidityChange(ev) {
        this.cardIsValid = !findKey(ev.fields, ({ isValid }) => !isValid);
    }

    @computed get isValid() {
        return this.cardIsValid && this.props.formState.valid;
    }

    renderForm() {
        const { purchase: { token }, event, fields } = this.props;
        if (!token) { return null; }

        const fieldProps = {
            sm: 6, xs: 12, fields,
        };
        return (
            <Braintree
                authorization={token}
                onError={this.onBTError}
                onValidityChange={this.onValidityChange}
                getTokenRef={t => (this.getBTToken = t)}
                styles={{
                    'input': {
                        'font-size': '16px',
                        'color': '#3a3a3a'
                    },
                    ':focus': {
                        'color': 'black'
                    }
                }}
            >
                <Row>

                    <FormField {...fieldProps} name="name" ref={f => (this.nameFieldRef = f)} />

                    <FormField {...fieldProps} name="email" />

                    <FormField {...fieldProps} name="phone" xs={6} />
                    <CardField
                        {...fieldProps} xs={6} type="postalCode"
                        label="Zip Code" errorMessage="is not valid" />

                    <CardField {...fieldProps} type="number" label="Card Number" errorMessage="Invalid Card" />

                    <CardField
                        {...fieldProps} xs={6} type="expirationDate"
                        label="Expiration" errorMessage="Invalid Date" />

                    <CardField
                        {...fieldProps} xs={6}
                        type="cvv" label="Card CVV" errorMessage="Invalid value" />


                    <Col xs={12}>
                        <Box
                            pad={{ between: 'medium' }}
                            direction="row"
                            align="center"
                            className="totals-line"
                        >
                            <h2>Ticket cost: </h2>
                            <Value
                                className="ea"
                                size="medium" value={event.priceForQty(1)} units='$' label="each"
                            />
                            <Box
                                direction="row" responsive={false} justify="between"
                                pad={{ between: 'medium' }}
                            >
                                <FormField fields={fields} name="qty" type="number" />
                                <Value
                                    className="total"

                                    size="medium"
                                    value={event.priceForQty(fields.qty.value)} units='$'
                                    label="total"
                                />
                            </Box>
                        </Box>
                    </Col>

                </Row>
            </Braintree>
        );
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

                    {this.renderForm()}

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


export default addFormFieldValidations(Purchase);
