import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { get } from 'lodash';
import { Row } from 'react-flexbox-grid';

import { Form, Field, FieldDefinitions, nonBlank } from 'lanes/components/form';

import Heading from 'grommet/components/Heading';
import BraintreeConfigModel from '../../models/brain-tree-config';

const KEY = 'braintree';

@observer
export default class BraintreeConfig extends React.PureComponent {

    static propTypes = {
        registerForSave: PropTypes.func.isRequired,
    }

    formFields = new FieldDefinitions({
        merchant_id: nonBlank,
        public_key:  nonBlank,
        private_key: nonBlank,
    })

    config = new BraintreeConfigModel()

    onSave() {
        if (!this.props.settings[KEY]) { this.props.settings[KEY] = {}; }
        this.formFields.persistTo(this.props.settings[KEY]);
    }

    componentWillMount() {
        this.props.registerForSave('bt', this);
        this.setFields(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setFields(nextProps);
    }

    setFields(props) {
        const config = get(props, `settings.${KEY}`, {});
        this.formFields.set(config);
    }

    render() {
        return (
            <Form tag="div" className="braintree-edit-form" fields={this.formFields}>
                <Heading tag="h3">Braintree payment settings</Heading>
                <Row>
                    <Field md={4} xs={6} name="merchant_id" />
                    <Field md={4} xs={6} name="public_key" />
                    <Field md={4} xs={6} name="private_key" />
                </Row>
            </Form>
        );
    }
}
