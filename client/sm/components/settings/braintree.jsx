import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { get } from 'lodash';
import { Row } from 'react-flexbox-grid';
import { Form, Field, FormState, nonBlank } from 'hippo/components/form';

import Heading from 'grommet/components/Heading';
import BraintreeConfigModel from '../../models/brain-tree-config';

const KEY = 'braintree';

@observer
export default class BraintreeConfig extends React.PureComponent {

    static propTypes = {
        registerForSave: PropTypes.func.isRequired,
    }

    formState = new FormState()

    config = new BraintreeConfigModel()

    onSave() {
        if (!this.props.settings[KEY]) { this.props.settings[KEY] = {}; }
        this.formState.persistTo(this.props.settings[KEY]);
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
        this.formState.set(config);
    }

    render() {
        return (
            <Form tag="div" className="braintree-edit-form" state={this.formState}>
                <Heading tag="h3">Braintree payment settings</Heading>
                <Row>
                    <Field sm={3} xs={6} type="checkbox" name="sandbox_mode" label="Sandbox Mode?" />
                    <Field sm={3} xs={6} name="public_key" validate={nonBlank} />
                    <Field sm={3} xs={6} name="private_key" validate={nonBlank} />
                    <Field sm={3} xs={6} name="merchant_id" validate={nonBlank} />
                </Row>
            </Form>
        );
    }

}
