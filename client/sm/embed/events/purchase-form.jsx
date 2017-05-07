import React from 'react';
import PropTypes from 'prop-types';
import { Braintree } from 'react-braintree-fields';
import { observer } from 'mobx-react';
import { Row, Col } from 'react-flexbox-grid';
import Box from 'grommet/components/Box';
import { observable, action, computed } from 'mobx';
import { findKey, mapValues, extend } from 'lodash';

import { Form, Field, FieldDefinitions, nonBlank, numberValue, validEmail, validPhone } from 'lanes/components/form';

import Value from 'grommet/components/Value';

import PurchaseModel from '../../models/embed/purchase';
import EventModel from '../../models/embed/event';

import CardField from './card-field';

@observer
export default class PurchaseForm extends React.PureComponent {
    static fields() {
        return new FieldDefinitions({
            qty: numberValue,
            name: nonBlank,
            email: validEmail,
            phone: validPhone,
        });
    }

    static propTypes = {
        fields: PropTypes.instanceOf(FieldDefinitions).isRequired,
        purchase: PropTypes.instanceOf(PurchaseModel).isRequired,
        event: PropTypes.instanceOf(EventModel).isRequired,
        onValidityChange: PropTypes.func.isRequired,
        setSave: PropTypes.func.isRequired,
    }

    @observable cardIsValid;
    @observable getToken;

    @computed get totalAmount() {
        return this.props.event.priceForQty(this.props.fields.get('qty').value);
    }

    @action.bound
    onBTValidityChange(ev) {
        const cardIsValid = !findKey(ev.fields, ({ isValid }) => !isValid);
        if (cardIsValid !== this.cardIsValid) {
            this.cardIsValid = cardIsValid;
            this.props.onValidityChange(this.cardIsValid);
        }
    }

    @action.bound
    setBraintreeToken(token) {
        this.getToken = token;
    }

    componentWillMount() {
        this.props.fields.setFromModel(this.props.purchase);
        this.props.setSave(this.saveState);
    }

    @action.bound
    onBTError(err) {
        this.props.purchase.errors = {
            card: err.message,
        };
    }

    @action.bound
    saveState({ purchase, event }) {
        const { fields } = this.props;
        return new Promise((resolve) => {
            this.getToken().then(({ nonce, details: { cardType: card_type, lastTwo: digits } }) => {
                fields.persistTo(purchase);
                extend(purchase, {
                    event_identifier: event.event_identifier,
                    payments: [{
                        nonce, card_type, digits, amount: this.totalAmount,
                    }],
                });
                resolve();
            }).catch((err) => {
                purchase.errors = { credit_card: err.message }; // eslint-disable-line
                resolve();
            });
        });
    }

    render() {
        const { fields, purchase: { token }, event } = this.props;

        if (!token) { return null; }

        const fieldProps = {
            sm: 6, xs: 12,
        };

        return (
            <Braintree
                authorization={token}
                onError={this.onBTError}
                onValidityChange={this.onBTValidityChange}
                getTokenRef={this.setBraintreeToken}
                styles={{
                    input: {
                        color: '#3a3a3a',
                        'font-size': '16px',
                    },
                    ':focus': {
                        color: 'black',
                    },
                }}
            >
                <Form tag="div" className="row" fields={fields}>

                    <Field {...fieldProps} name="name" />

                    <Field {...fieldProps} name="email" />

                    <Field {...fieldProps} name="phone" xs={6} />
                    <CardField
                        {...fieldProps} xs={6} type="postalCode"
                        label="Zip Code" errorMessage="is not valid" />

                    <CardField
                        {...fieldProps}
                        type="number" label="Card Number" errorMessage="Invalid Card" />

                    <CardField
                        {...fieldProps} xs={6} type="expirationDate"
                        placeholder="MM / YY" label="Expiration" errorMessage="Invalid Date" />

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
                                <Field
                                    name="qty"
                                    type="number"
                                    min={1}
                                />
                                <Value
                                    className="total"
                                    size="medium"
                                    value={this.totalAmount} units='$'
                                    label="total"
                                />
                            </Box>
                        </Box>
                    </Col>

                </Form>
            </Braintree>
        );
    }
}
