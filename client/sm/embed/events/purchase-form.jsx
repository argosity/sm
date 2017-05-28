import React from 'react';

import { Braintree } from 'react-braintree-fields';
import { observer } from 'mobx-react';
import { Col } from 'react-flexbox-grid';
import Box from 'grommet/components/Box';
import { observable, action, computed } from 'mobx';
import { findKey, extend } from 'lodash';

import { Form, Field, nonBlank, numberValue, validEmail, validPhone } from 'hippo/components/form';

import Value from 'grommet/components/Value';

import CardField from './card-field';

@observer
export default class PurchaseForm extends React.PureComponent {

    @observable cardIsValid;
    @observable getToken;

    componentDidMount() {
        this.props.formState.setFromModel(this.props.purchase);
        this.props.setSave(this.saveState);
    }

    @computed get totalAmount() {
        return this.props.event.priceForQty(this.props.formState.get('qty.value', 1));
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

    @action.bound
    onBTError(err) {
        this.props.purchase.errors = {
            card: err.message,
        };
    }

    @action.bound
    saveState({ purchase, event }) {
        const { formState } = this.props;
        return new Promise((resolve) => {
            this.getToken().then(({ nonce, details: { cardType: card_type, lastTwo: digits } }) => {
                formState.persistTo(purchase);
                extend(purchase, {
                    event_identifier: event.identifier,
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
        const { formState, purchase: { token }, event } = this.props;

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
                <Form tag="div" className="row" state={formState}>

                    <Field {...fieldProps} name="name" validate={nonBlank} />

                    <Field {...fieldProps} name="email" validate={validEmail} />

                    <Field {...fieldProps} name="phone" xs={6} validate={validPhone} />
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
                                    validate={numberValue}
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
