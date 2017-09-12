import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { observable, action, computed } from 'mobx';
import { get, extend, each, findKey, map } from 'lodash';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { Braintree } from 'react-braintree-fields';
import { Row, Col } from 'react-flexbox-grid';
import Box from 'grommet/components/Box';
import Value from 'grommet/components/Value';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import CreditCardIcon from 'grommet/components/icons/base/CreditCard';
import FormField from 'grommet/components/FormField';
import Select    from 'grommet/components/Select';

import {
    FormState, Form, Field, nonBlank, numberValue, validEmail, validPhone,
} from 'hippo/components/form';
import NetworkActivityOverlay from 'hippo/components/network-activity-overlay';
import WarningNotification from 'hippo/components/warning-notification';

import './purchase-form-styles.scss';
import CardField from './card-field';
import Arrow from './pointer-arrow';

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

    @computed get timeOptions() {
        return map(this.show.futureTimes, t => ({
            time: t,
            label: (
                <Box key={t.identifier} direction='row' justify='between' responsive={false}>
                    <span>{t.formattedOccursAt}</span>
                    <span>{t.formattedPrice}</span>
                </Box>
            ),
        }));
    }

    @action.bound
    onTimeChange({ value: { time } }) {
        this.props.purchase.time = time;
    }

    @computed get show() {
        return get(this.props.purchase, 'time.show', this.props.purchase.show);
    }

    @computed get orderFieldsClass() {
        return cn('main-fields', {
            obscured: (1 !== this.show.times.length && !this.props.purchase.time),
        });
    }

    renderTimes() {
        const { show, props: { purchase } } = this;

        if (1 === show.times.length) {
            return <h3>{show.times[0].formattedOccursAt}</h3>;
        }
        return (
            <FormField label='Show'>
                <Select
                    className="times"
                    value={
                        purchase.time ? purchase.time.formattedOccursAt : ''
                    }
                    onChange={this.onTimeChange}
                    options={this.timeOptions}
                />
            </FormField>
        );
    }

    renderSelectionPrompt() {
        if (this.props.purchase.time) { return null; }
        return (
            <div className="selection-prompt">
                <Arrow />
                <h3>Select show time</h3>
            </div>
        );
    }

    render() {
        const { formState, props: { purchase } } = this;
        if (!purchase.token) { return null; }

        const fieldProps = { sm: 6, xs: 12 };

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

                <Form
                    tag="div"
                    className="purchase-form row"
                    state={formState}
                >
                    <Col xs={12}>
                        <WarningNotification message={purchase.errorMessage} />
                        <Box className="heading" flex>{this.heading}</Box>
                        <Box
                            pad={{ between: 'small' }}
                            className="totals-line"
                            wrap
                            direction="row"
                            align="center"
                        >
                            <Box className="title" flex>
                                {this.renderTimes()}
                            </Box>
                            <Field
                                className="qty"
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
                    </Col>
                    <Col xs={12} className={this.orderFieldsClass}>
                        {this.renderSelectionPrompt()}
                        <Row className="fields">
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
                        </Row>
                    </Col>
                </Form>
            </Braintree>
        );
    }

}
