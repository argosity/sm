import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { autobind } from 'core-decorators';
import { observable, action, computed } from 'mobx';
import { get, extend, each, findKey, map } from 'lodash';
import { observer } from 'mobx-react';
import PaymentFields from 'payment-fields';
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

import './sale-form-styles.scss';
import CardField from './card-field';
import Arrow from './pointer-arrow';
import Sale from '../../models/sale';
import Payment from '../../models/payment';
import SM from '../../extension';

@observer
export default class SaleForm extends React.PureComponent {

    static propTypes = {
        sale: PropTypes.instanceOf(Sale).isRequired,
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
    @observable payment = new Payment();

    @observable fields = {
        postalCode: false,
        cardNumber: false,
        expirationDate: false,
        cvv: false,
    }

    componentWillMount() {
        this.payment.fetchToken().then(() => {
            this.formState.setFromModel(this.props.sale);
        });
    }

    @computed get totalAmount() {
        return this.props.sale.priceForQty(
            get(this.formState.get('qty'), 'value', 1) || 1,
        );
    }

    @action.bound
    onError(err) {
        this.props.sale.errors = {
            card: err.message,
        };
    }

    @action.bound onValidityChange({ isValid }) {
        this.cardIsValid = isValid;
    }

    @computed get isValid() {
        return Boolean(this.cardIsValid && this.formState.isValid);
    }

    @action
    exposeErrors() {
        this.formState.exposeErrors();
        each(this.fields, f => f.exposeError());
    }

    @computed get heading() {
        return this.props.heading || <h3>{get(this.props.sale, 'time.show.title')}</h3>;
    }

    @action
    saveState() {
        const { sale } = this.props;
        return new Promise((resolve) => {
            this.getToken().then(({ token, cardData }) => {
                this.formState.persistTo(sale);

                extend(this.payment, {
                    nonce: token, amount: this.totalAmount,
                    card_type: cardData.card_brand,
                    digits: cardData.last_4,
                });
                extend(sale, {
                    time_identifier: sale.time.identifier,
                    payments: [this.payment],
                });
                resolve(sale);
            }).catch((err) => {
                sale.errors = { credit_card: err.message }; // eslint-disable-line
                resolve();
            });
        });
    }

    @action.bound
    setFieldRef(ref) {
        if (ref) {
            this.fields[ref.props.type] = ref;
        }
    }

    @action.bound
    onSaleClick() {
        if (!this.isValid) {
            this.exposeErrors();
            return;
        }
        const { sale } = this.props;
        sale.errors = null;
        this.isTokenizing = true;
        this.saveState().then(() => {
            this.isTokenizing = false;
            if (sale.isValid) {
                sale.save().then(() => {
                    if (sale.isValid) {
                        this.props.onComplete();
                    }
                });
            }
        }).catch((err) => {
            sale.errors = { invalid: err.message }; // eslint-disable-line
            this.isTokenizing = false;
        });
    }

    @computed get isBusy() {
        return Boolean(
            this.isTokenizing || get(this.payment, 'syncInProgress.isFetch'),
        );
    }

    @computed get busyMessage() {
        return this.props.sale.errorMessage || (
            this.isTokenizing ? 'Purchasing…' : 'Loading…'
        );
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
        this.props.sale.time = time;
    }

    @computed get show() {
        return get(this.props.sale, 'time.show', this.props.sale.show);
    }

    @computed get orderFieldsClass() {
        return cn('main-fields', {
            obscured: (1 !== this.show.times.length && !this.props.sale.time),
        });
    }

    renderTimes() {
        const { show, props: { sale } } = this;

        if (1 === show.times.length) {
            return <h3>{show.times[0].formattedOccursAt}</h3>;
        }
        return (
            <FormField label='Show'>
                <Select
                    className="times"
                    value={
                        sale.time ? sale.time.formattedOccursAt : ''
                    }
                    onChange={this.onTimeChange}
                    options={this.timeOptions}
                />
            </FormField>
        );
    }

    renderSelectionPrompt() {
        if (this.props.sale.time) { return null; }
        return (
            <div className="selection-prompt">
                <Arrow />
                <h3>Select show time</h3>
            </div>
        );
    }

    @autobind onFormReady(ev) {
        this.getToken = ev.tokenize;
    }

    render() {
        const { formState, props: { sale } } = this;
        console.log(SM.paymentsVendor, this.payment.token);
        const fieldProps = { sm: 6, xs: 12 };

        return (
            <PaymentFields
                onError={this.onError}
                onReady={this.onFormReady}
                vendor={SM.paymentsVendor}
                onValidityChange={this.onValidityChange}
                authorization={this.payment.token}
                styles={{
                    base: {
                        color: '#3a3a3a',
                        'font-size': '16px',
                    },
                    focus: {
                        color: 'black',
                    },
                }}
            >
                <NetworkActivityOverlay
                    message={this.busyMessage}
                    visible={this.isBusy}
                    model={sale}
                />

                <Form
                    tag="div"
                    className="sale-form row"
                    state={formState}
                >
                    <Col xs={12}>
                        <WarningNotification message={sale.errorMessage} />
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
                                {...fieldProps} xs={6} type="postalCode"
                                ref={this.setFieldRef}
                                label="Zip Code" errorMessage="is not valid"
                            />
                            <CardField
                                {...fieldProps} ref={this.setFieldRef}
                                type="cardNumber" label="Card Number"
                                errorMessage="Invalid Card"
                            />
                            <CardField
                                {...fieldProps} sm={3} xs={6} ref={this.setFieldRef}
                                type="expirationDate" placeholder="MM / YY"
                                label="Expiration" errorMessage="Invalid Date"
                            />
                            <CardField
                                {...fieldProps} sm={3} xs={6} ref={this.setFieldRef}
                                type="cvv" label="Card CVV" errorMessage="Invalid value"
                            />
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
            </PaymentFields>
        );
    }

}
