import React from 'react';
import FieldWrapper from 'grommet/components/FormField';
import PaymentFields from 'payment-fields';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { getColumnProps } from 'react-flexbox-grid';
import classnames from 'classnames';

@observer
export default class PurchaseField extends React.PureComponent {

    @action.bound
    onFocus() {
        this.errorMessage = '';
    }

    @action.bound
    onBlur({ isValid }) {
        this.isValid = isValid;
        this.errorMessage = isValid ? '' : this.props.errorMessage;
    }

    @observable isValid = false;
    @observable errorMessage = '';

    @action.bound onValidityChange({ isValid }) {
        this.isValid = isValid;
        this.errorMessage = isValid ? '' : this.props.errorMessage;
    }

    exposeError() {
        if (!this.isValid) {
            this.errorMessage = this.props.errorMessage;
        }
    }

    @action.bound
    setRef(f) { this.wrapper = f; }

    render() {
        const {
            label, className, ...cardFieldProps
        } = getColumnProps(this.props);
        return (
            <div className={classnames('card form-field', className)}>
                <FieldWrapper
                    error={this.errorMessage}
                    label={label}
                    ref={this.setRef}
                >
                    <PaymentFields.Field
                        {...cardFieldProps}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                    />
                </FieldWrapper>
            </div>
        );
    }

}
