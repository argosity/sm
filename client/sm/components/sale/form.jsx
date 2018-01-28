import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { autobind } from 'core-decorators';
import { observable, action, computed } from 'mobx';
import { get, extend, each, map } from 'lodash';
import { observer } from 'mobx-react';
import PaymentFields from 'payment-fields';
import { Col } from 'react-flexbox-grid';
import { Box, Button, Select } from 'grommet';
import { CreditCard } from 'grommet-icons';
import Value from 'hippo/components/value';
import Spinning from 'hippo/components/icon/spinning';
import {
    FormState, Form, Field, nonBlank, numberValue, validEmail, FieldWrapper,
} from 'hippo/components/form';
import NetworkActivityOverlay from 'hippo/components/network-activity-overlay';
import WarningNotification from 'hippo/components/warning-notification';
import CardField from 'hippo/components/payments/field';

import StyledForm from './styled-sale-form';

import Arrow from './pointer-arrow';
import Sale from '../../models/sale';
import Payment from '../../models/payment';
import SM from '../../extension';


const PaymentFieldsWrapperMock = ({ className, children }) =>
    <div className={className}>{children}</div>;

@observer
export default class SaleForm extends React.Component {

    static propTypes = {
        sale: PropTypes.instanceOf(Sale).isRequired,
        onComplete: PropTypes.func.isRequired,
        controls: PropTypes.node,
        online: PropTypes.bool,
        heading: PropTypes.oneOfType([
            PropTypes.string, PropTypes.node,
        ]),
    }

    static defaultProps = {
        heading:  '',
        online: false,
    }

    @observable formState = new FormState()
    @observable payment = new Payment();
    @observable cardIsvalid;
    @observable isSaving;

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

    get isValid() {
        return this.formState.isValid;
    }

    @action exposeErrors() {
        this.formState.exposeErrors();
        each(this.fields, f => f.exposeError());
    }

    @computed get heading() {
        if (this.props.heading) { return this.props.heading; }
        const title = get(this.props.sale, 'time.show.title');
        if (title) {
            const pre = this.props.sale.noCharge ? 'Create' : 'Sell';
            return <h4>{pre} tickets for {title}</h4>;
        }
        return null;
    }

    @action saveState() {
        const { sale } = this.props;
        sale.time_identifier = sale.time.identifier;

        return new Promise((resolve) => {
            if (sale.noCharge) {
                this.formState.persistTo(sale);
                resolve(sale);
                return;
            }

            this.getToken().then(({ token, cardData }) => {
                this.formState.persistTo(sale);

                extend(this.payment, {
                    nonce: token,
                    amount: this.totalAmount,
                    card_type: cardData.card_brand,
                    digits: cardData.last_4,
                });
                sale.payments = [this.payment];

                resolve(sale);
            }).catch(({ errors }) => {
                const err = errors[0] || {};
                sale.errors = { processing_error: err.message || '' }; // eslint-disable-line
                resolve(sale);
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
        this.isSaving = true;
        this.saveState().then(() => {
            if (sale.isValid) {
                sale.save().then(() => {
                    this.isSaving = false;
                    if (sale.isValid) {
                        this.props.onComplete(sale);
                    }
                });
            } else {
                this.isSaving = false;
            }
        }).catch((err) => {
            sale.errors = { invalid: err.message }; // eslint-disable-line
            this.isSaving = false;
        });
    }

    @computed get isBusy() {
        return Boolean(
            this.isSaving || get(this.payment, 'syncInProgress.isFetch'),
        );
    }

    @computed get busyMessage() {
        return this.props.sale.errorMessage || (
            this.isSaving ? 'Purchasing…' : 'Loading…'
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

    @computed get showTimes() {
        return this.props.online ? this.show.onlinePurchasableTimes : this.show.times;
    }

    renderTimes() {
        const { showTimes, props: { sale } } = this;
        if (1 === showTimes.length) {
            return <h3>{showTimes[0].formattedOccursAt}</h3>;
        }
        return (
            <FieldWrapper label='Show'>
                <Select
                    className="times"
                    value={
                        sale.time ? sale.time.formattedOccursAt : ''
                    }
                    onChange={this.onTimeChange}
                    options={this.timeOptions}
                />
            </FieldWrapper>
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

    get fieldProps() {
        return { sm: 6, xs: 12 };
    }

    @computed get saveButtonLabel() {
        if (this.isSaving) {
            return this.props.sale.noCharge ? 'Saving…' : 'Purchasing…';
        }
        return this.props.sale.noCharge ? 'Save' : 'Purchase';
    }

    renderCardFields() {
        if (this.props.sale.noCharge) { return null; }
        const { fieldProps } = this;

        return [
            <Col key="postalCode" {...fieldProps} xs={6}>
                <CardField
                    type="postalCode"
                    ref={this.setFieldRef}
                    label="Zip Code" errorMessage="is required"
                />
            </Col>,
            <Col key="cardNumber" {...fieldProps}>
                <CardField
                    placeholder="•••• •••• •••• ••••"
                    ref={this.setFieldRef}
                    type="cardNumber" label="Card Number"
                    errorMessage="Invalid Card"
                />
            </Col>,
            <Col key="expirationDate" {...fieldProps} sm={3} xs={6}>
                <CardField
                    ref={this.setFieldRef}
                    type="expirationDate" placeholder="MM / YY"
                    label="Expiration" errorMessage="Invalid Date"
                />
            </Col>,
            <Col key="cvv" {...fieldProps} sm={3} xs={6}>
                <CardField
                    ref={this.setFieldRef}
                    type="cvv" label="Card CVV" errorMessage="Invalid value"
                />
            </Col>,
        ];
    }

    render() {
        const {
            fieldProps, formState, isSaving, props: { sale },
        } = this;

        const FieldsWrapper = this.props.sale.noCharge ? PaymentFieldsWrapperMock : PaymentFields;

        return (
            <Form state={formState}>
                <StyledForm>
                    <NetworkActivityOverlay
                        message={this.busyMessage}
                        visible={this.isBusy}
                        model={sale}
                    />
                    <Col xs={12}>
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

                        <FieldsWrapper
                            className="row fields"
                            onError={this.onError}
                            onReady={this.onFormReady}
                            vendor={SM.paymentsVendor}
                            onValidityChange={this.onValidityChange}
                            authorization={this.payment.token}
                            styles={{
                                base: {
                                    color: '#3a3a3a',
                                    'line-height': '40px',
                                    'font-size': '16px',
                                },
                                focus: {
                                    color: 'black',
                                },
                            }}
                        >
                            <Col {...fieldProps}>
                                <Field name="name" validate={nonBlank} />
                            </Col>
                            <Col {...fieldProps}>
                                <Field type="email" name="email" validate={validEmail} />
                            </Col>
                            <Col {...fieldProps} xs={6}>
                                <Field {...fieldProps} name="phone" />
                            </Col>

                            {this.renderCardFields()}

                            <Col xs={12}>
                                <WarningNotification
                                    flex margin="medium"
                                    message={sale.errorMessage}
                                />
                            </Col>

                            <Col xs={12}>
                                <Box
                                    margin={{ vertical: 'medium' }}
                                    pad={{ between: 'medium' }}
                                    justify="end"
                                >
                                    {this.props.controls}
                                    <Button
                                        primary
                                        label={this.saveButtonLabel}
                                        icon={isSaving ? <Spinning /> : <CreditCard />}
                                        onClick={isSaving ? null : this.onSaleClick}
                                    />
                                </Box>
                            </Col>
                        </FieldsWrapper>
                    </Col>
                </StyledForm>
            </Form>
        );
    }

}
