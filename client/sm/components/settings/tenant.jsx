import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Row } from 'react-flexbox-grid';
import Heading from 'grommet/components/Heading';
import { Form, Field, FieldDefinitions, nonBlank } from 'lanes/components/form';
import Tenant from '../../models/tenant';

@observer
export default class TenantConfig extends React.PureComponent {

    static propTypes = {
        registerForSave: PropTypes.func.isRequired,
    }

    formFields = new FieldDefinitions({
        slug: nonBlank,
        name: nonBlank,
    })

    onSave() {
        this.formFields.persistTo(Tenant.current)
            .then(() => Tenant.current.save());
    }

    componentWillMount() {
        this.props.registerForSave('tn', this);
        this.formFields.setFromModel(Tenant.current);
    }

    render() {
        const { fields } = this.props;
        return (
            <Form tag="div" className="tenant-edit-form" fields={this.formFields}>
                <Heading tag="h3">Account</Heading>
                <Row>
                    <Field md={4} xs={6} name="slug" label="Identifier" />
                    <Field md={4} xs={6} name="name" />
                </Row>
            </Form>
        );
    }
}
