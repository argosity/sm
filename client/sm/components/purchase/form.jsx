import React from 'react';
import PropTypes from 'prop-types';
import { observable, action, computed } from 'mobx';
import { map, get, extend, each, findKey } from 'lodash';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { Braintree } from 'react-braintree-fields';
import { Col } from 'react-flexbox-grid';
import Box from 'grommet/components/Box';
import Value from 'grommet/components/Value';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import CreditCardIcon from 'grommet/components/icons/base/CreditCard';
import {
    FormState, Form, Field, nonBlank, numberValue, validEmail, validPhone,
} from 'hippo/components/form';
import NetworkActivityOverlay from 'hippo/components/network-activity-overlay';
import WarningNotification from 'hippo/components/warning-notification';

import './purchase-form-styles.scss';
import CardField from './card-field';

@observer
export default class PurchaseForm extends React.PureComponent {
    static propTypes = {
        purchase: MobxPropTypes.observableObject.isRequired,
        onComplete: PropTypes.func.isRequired,
        controls: PropTypes.node,
        heading: PropTypes.oneOfType([
            PropTypes.string, PropTypes.node,
        ]),
    }

    static defaultProps = {
        heading:  '',
    }

    @observable formState = new FormState()

    @observable btFields = {
        postalCode: false,
        number: false,
        expirationDate: false,
        cvv: false,
    }

    componentWillMount() {
        this.props.purchase.fetchToken().then(() => {
            this.formState.setFromModel(this.props.purchase);
        });
    }

    @computed get totalAmount() {
        return this.props.purchase.priceForQty(
            get(this.formState.get('qty'), 'value', 1) || 1,
        );
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
    onBTValidityChange(ev) {
        this.cardIsValid = !findKey(ev.fields, ({ isValid }) => !isValid);
    }

    @action.bound
    onValidityChange(isValid) {
        this.isFormValid = isValid;
    }

    @computed get isValid() {
        return Boolean(this.cardIsValid && this.formState.isValid);
    }

    @action
    exposeErrors() {
        this.formState.exposeErrors();
        each(this.btFields, f => f.exposeError());
    }

    @computed get heading() {
        return this.props.heading || <h3>{get(this.props.purchase, 'time.show.title')}</h3>;
    }

    @action
    saveState() {
        const { purchase } = this.props;
        return new Promise((resolve) => {
            this.getToken().then(({ nonce, details: { cardType: card_type, lastTwo: digits } }) => {
                this.formState.persistTo(purchase);
                extend(purchase, {
                    time_identifier: purchase.time.identifier,
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

    @computed get timeOptions() {
        return map(this.props.show.futureTimes, o => ({
            time: o,
            label: (
                <Box direction='row' justify='between' responsive={false}>
                    <span>{o.formattedOccurs}</span>
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
    setBtFieldRef(ref) {
        if (ref) {
            this.btFields[ref.props.type] = ref;
        }
    }

    @action.bound
    onSaleClick() {
        if (!this.isValid) {
            this.exposeErrors();
            return;
        }
        const { purchase } = this.props;
        purchase.errors = null;
        this.isTokenizing = true;
        this.saveState().then(() => {
            this.isTokenizing = false;
            if (purchase.isValid) {
                purchase.save().then(() => {
                    if (purchase.isValid) {
                        this.props.onComplete();
                    }
                });
            }
        }).catch((err) => {
            purchase.errors = { invalid: err.message }; // eslint-disable-line
            this.isTokenizing = false;
        });
    }

    renderForm() {
        const { formState, props: { purchase } } = this;
        if (!purchase.token) { return null; }
        const fieldProps = { sm: 6, xs: 12 };
        return (

            <Form
                tag="div"
                className="purchase-form row"
                state={formState}
            >
                <Col xs={12}>
                    <WarningNotification message={purchase.errorMessage} />
                    <Box
                        pad={{ between: 'small' }}
                        className="totals-line"
                        direction="row"
                        align="center"
                    >
                        <Box
                            className="heading"
                            direction="row"
                            responsive={false}
                            justify="between"
                            flex wrap
                            align="center"
                            pad={{ between: 'medium' }}
                        >
                            <Box className="title" flex>{this.heading}</Box>
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
                <Col xs={12}>
                    <Footer
                        margin={{ vertical: 'medium' }}
                        pad={{ between: 'medium' }}
                        justify="end"
                    >
                        {this.props.controls}
                        <Button
                            icon={<CreditCardIcon />}
                            label={'Purchase'}
                            onClick={this.onSaleClick}
                        />
                    </Footer>
                </Col>
            </Form>
        );
    }

    render() {
        const { purchase } = this.props;
        if (!purchase.token) { return null; }

        return (
            <Braintree
                authorization={purchase.token}
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
                <NetworkActivityOverlay
                    message={purchase.errorMessage || 'Purchasing…'}
                    visible={this.isTokenizing}
                    model={purchase}
                />
                {this.renderForm()}
            </Braintree>
        );
    }
}
