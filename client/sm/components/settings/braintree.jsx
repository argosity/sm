import React from 'react';

import { observer } from 'mobx-react';
import { mapValues, pick, keys, isEmpty } from 'lodash';
import { Row } from 'react-flexbox-grid';
import { addFormFieldValidations, stringValue } from 'lanes/lib/forms';
import Field from 'lanes/components/form-field';
import Heading from 'grommet/components/Heading';
import BraintreeConfigModel from '../../models/brain-tree-config';
import User from 'lanes/user';

const KEY = 'braintree';

@observer
class BraintreeConfig extends React.PureComponent {

    static formFields = {
        merchant_id: stringValue,
        public_key:  stringValue,
        private_key: stringValue,
    }

    config = new BraintreeConfigModel()

    onSave() {
        this.props.settings[KEY] = mapValues(this.props.fields, 'value');
    }

    componentWillMount() {
        this.props.registerForSave('bt', this);
        this.setDefaults(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setDefaults(nextProps);
    }

    setDefaults(props) {
        const config = pick(props.settings[KEY] || {}, keys(this.constructor.formFields));
        if (!isEmpty(config)) {
            this.props.setDefaultValues(config);
        }
    }

    render() {
        const { fields } = this.props;

        return (
            <div>
                <Heading tag="h3">Braintree payment settings</Heading>
                <Row>
                    <Field md={4} xs={6} name="merchant_id" fields={fields} />
                    <Field md={4} xs={6} name="public_key" fields={fields} />
                    <Field md={4} xs={6} name="private_key" fields={fields} />
                </Row>
            </div>
        );
    }

}


export default addFormFieldValidations(BraintreeConfig);
