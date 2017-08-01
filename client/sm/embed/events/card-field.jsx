import React from 'react';
import FieldWrapper from 'grommet/components/FormField';
import { HostedField } from 'react-braintree-fields';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { getColumnProps } from 'react-flexbox-grid';
import classnames from 'classnames';

@observer
export default class PurchaseField extends React.PureComponent {

    @action.bound
    onFocus() {
        this.wrapper._onFocus();  // eslint-disable-line no-underscore-dangle
        this.errorMessage = this.isPotentiallyValid ? '' : this.props.errorMessage;
    }

    @action.bound
    onBlur() {
        this.wrapper._onBlur(); // eslint-disable-line no-underscore-dangle
        if (!this.isValid) {
            this.errorMessage = this.props.errorMessage;
        }
    }

    @observable isValid = false;
    @observable errorMessage = '';
    @observable isPotentiallyValid = true;

    @action.bound
    onValidityChange({ isValid, isPotentiallyValid }) {
        this.isValid = isValid;
        this.isPotentiallyValid = isPotentiallyValid;
        this.errorMessage = isPotentiallyValid ? '' : this.props.errorMessage;
    }

    exposeError() {
        if (!this.isValid) {
            this.errorMessage = this.props.errorMessage;
        }
    }


    render() {
        const {
            label, className, ...cardFieldProps
        } = getColumnProps(this.props);
        return (
            <div className={classnames('form-field', className)}>
                <FieldWrapper
                    error={this.errorMessage}
                    label={label}
                    ref={f => (this.wrapper = f)}
                >
                    <HostedField
                        {...cardFieldProps}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        onValidityChange={this.onValidityChange}
                    />
                </FieldWrapper>
            </div>
        );
    }
}
