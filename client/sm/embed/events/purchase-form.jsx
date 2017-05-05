import React from 'react';
import PropTypes from 'prop-types';
import { Braintree } from 'react-braintree-fields';
import { observer } from 'mobx-react';
import { Row, Col } from 'react-flexbox-grid';
import Box from 'grommet/components/Box';
import { observable, action, computed } from 'mobx';
import { findKey, mapValues, extend } from 'lodash';

import {
    addFormFieldValidations, setFieldsFromModel, nonBlank, stringValue, validEmail, numberValue, validPhone,
} from 'lanes/lib/forms';

import Value from 'grommet/components/Value';
import FormField from 'lanes/components/form-field';

import PurchaseModel from '../../models/embed/purchase';
import EventModel from '../../models/embed/event';

import CardField from './card-field';

@observer
class PurchaseForm extends React.PureComponent {
    static propTypes = {
        purchase: PropTypes.instanceOf(PurchaseModel).isRequired,
        event: PropTypes.instanceOf(EventModel).isRequired,
        onValidityChange: PropTypes.func.isRequired,
        setSave: PropTypes.func.isRequired,
    }

    static formFields = {
        qty: numberValue,
        name: nonBlank,
        email: validEmail,
        phone: validPhone,
    }

    @observable cardIsValid;
    @observable getToken;

    @computed get totalAmount() {
        return this.props.event.priceForQty(this.props.fields.qty.value);
    }

    @action.bound
    onBTValidityChange(ev) {
        const cardIsValid = !findKey(ev.fields, ({ isValid }) => !isValid);
        if (cardIsValid !== this.cardIsValid) {
            this.cardIsValid = cardIsValid;
            this.props.onValidityChange(this.cardIsValid && this.props.formState.valid);
        }
    }

    @action.bound
    setBraintreeToken(token) {
        this.getToken = token;
    }

    componentWillMount() {
        setFieldsFromModel(this.props, this.props.purchase);
        this.props.setSave(this.saveState);
    }

    componentWillReceiveProps(props) {
        if (props.formState.valid !== this.props.formState.valid) {
            this.props.onValidityChange(this.cardIsValid && props.formState.valid);
        }
    }

    @action.bound
    saveState({ purchase, event }) {
        const { fields } = this.props;
        return new Promise((resolve) => {
            this.getToken().then(({ nonce, details: { cardType: card_type, lastTwo: digits } }) => {
                purchase.update(mapValues(fields, 'value'));
                extend(purchase, {
                    event,
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
        const { purchase: { token }, event, fields } = this.props;

        if (!token) { return null; }

        const fieldProps = {
            sm: 6, xs: 12, fields,
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
                <Row>

                    <FormField {...fieldProps} name="name" />

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
                                <FormField
                                    fields={fields}
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

                </Row>
            </Braintree>
        );
    }
}

export default addFormFieldValidations(PurchaseForm);
