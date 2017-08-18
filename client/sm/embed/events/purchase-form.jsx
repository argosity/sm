import React from 'react';

import { Braintree } from 'react-braintree-fields';
import { observer } from 'mobx-react';
import { Col } from 'react-flexbox-grid';
import Box from 'grommet/components/Box';
import FormField from 'grommet/components/FormField';
import Select from 'grommet/components/Select';
import { observable, action, computed } from 'mobx';
import { map, findKey, extend, each } from 'lodash';
import { Form, Field, nonBlank, numberValue, validEmail, validPhone } from 'hippo/components/form';

import Value from 'grommet/components/Value';

import CardField from './card-field';

@observer
export default class PurchaseForm extends React.PureComponent {
    @observable cardIsValid;
    @observable getToken;

    @observable btFields = {
        postalCode: false,
        number: false,
        expirationDate: false,
        cvv: false,
    }

    componentDidMount() {
        this.props.formState.setFromModel(this.props.purchase);
        this.props.purchase.event = this.props.event;
    }

    @computed get totalAmount() {
        return this.props.purchase.priceForQty(this.props.formState.get('qty.value', 1));
    }

    @action.bound
    onBTValidityChange(ev) {
        this.btState = ev;
        const cardIsValid = !findKey(ev.fields, ({ isValid }) => !isValid);
        if (cardIsValid !== this.cardIsValid) {
            this.cardIsValid = cardIsValid;
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
    onValidityChange(isValid) {
        this.isFormValid = isValid;
    }

    @computed get isValid() {
        return Boolean(this.cardIsValid && this.props.formState.isValid);
    }

    @action
    exposeErrors() {
        this.props.formState.exposeErrors();
        each(this.btFields, f => f.exposeError());
    }

    @action
    saveState() {
        const { formState, purchase } = this.props;
        return new Promise((resolve) => {
            this.getToken().then(({ nonce, details: { cardType: card_type, lastTwo: digits } }) => {
                formState.persistTo(purchase);
                extend(purchase, {
                    occurrence_identifier: purchase.occurrence.identifier,
                    payments: [{
                        nonce, card_type, digits, amount: this.totalAmount,
                    }],
                });
                resolve(purchase);
            }).catch((err) => {
                purchase.errors = { credit_card: err.message }; // eslint-disable-line
                resolve();
            });
        });
    }


    @computed get occurrenceOptions() {
        return map(this.props.event.futureOccurrences, o => ({
            occurrence: o,
            label: (
                <Box direction='row' justify='between' responsive={false}>
                    <span>{o.formattedOccurs}</span>
                    <span>{o.formattedPrice}</span>
                </Box>
            ),
        }));
    }

    @action.bound
    onOccurrenceChange({ value: { occurrence } }) {
        this.props.purchase.occurrence = occurrence;
    }

    @action.bound
    setBtFieldRef(ref) {
        if (ref) {
            this.btFields[ref.props.type] = ref;
        }
    }

    renderOccurs() {
        const { event } = this.props;
        if (1 === event.occurrences.length) {
            return (
                <Box direction="row" justify="between">
                    <h2>Ticket cost: </h2>
                    <Value
                        className="ea"
                        size="medium"
                        value={event.priceForQty(1)}
                        units='$'
                        reverse
                        label="each"
                    />
                </Box>
            );
        }
        return (
            <FormField label='Event'>
                <Select
                    className="occurrences"
                    value={
                        this.props.purchase.occurrence ?
                            this.props.purchase.occurrence.formattedOccurs : ''
                    }
                    onChange={this.onOccurrenceChange}
                    options={this.occurrenceOptions}
                />
            </FormField>
        );
    }

    render() {
        const { formState, purchase: { token } } = this.props;
        if (!token) { return null; }
        const fieldProps = { sm: 6, xs: 12 };

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
                    <Col xs={12}>
                        <Box
                            pad={{ between: 'small' }}
                            className="totals-line"
                            direction="row"
                            align="center"
                        >
                            {this.renderOccurs()}
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
                    <Field {...fieldProps} name="name" validate={nonBlank} />
                    <Field {...fieldProps} name="email" validate={validEmail} />
                    <Field {...fieldProps} name="phone" xs={6} validate={validPhone} />
                    <CardField
                        {...fieldProps} xs={6} type="postalCode" ref={this.setBtFieldRef}
                        label="Zip Code" errorMessage="is not valid" />
                    <CardField
                        {...fieldProps} ref={this.setBtFieldRef}
                        type="number" label="Card Number" errorMessage="Invalid Card" />
                    <CardField
                        {...fieldProps} sm={3} xs={6} ref={this.setBtFieldRef}
                        type="expirationDate" placeholder="MM / YY" label="Expiration" errorMessage="Invalid Date" />
                    <CardField
                        {...fieldProps} sm={3} xs={6} ref={this.setBtFieldRef}
                        type="cvv" label="Card CVV" errorMessage="Invalid value" />
                </Form>
            </Braintree>
        );
    }
}
