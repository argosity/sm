import React from 'react';

import { observer } from 'mobx-react';
import { Row, Col } from 'react-flexbox-grid';
import { addFormFieldValidations,
         persistFieldValues,
         stringValue,
         setFieldsFromModel,
} from 'lanes/lib/forms';


import Heading from 'grommet/components/Heading';

import Field from 'lanes/components/form-field';
import Tenant from '../../models/tenant';

@observer
class TenantConfig extends React.PureComponent {

    static formFields = {
        slug: stringValue,
        name: stringValue,
    }

    onSave() {
        persistFieldValues(this.props, Tenant.current)
            .then(() => Tenant.current.save());
    }

    componentWillMount() {
        this.props.registerForSave('tn', this);
        setFieldsFromModel(this.props, Tenant.current);
    }

    render() {
        const { fields } = this.props;
        return (
            <div>
                <Heading tag="h3">Account</Heading>
                <Row>
                    <Field md={4} xs={6} name="slug" label="Identifier" fields={fields} />
                    <Field md={4} xs={6} name="name" fields={fields} />
                </Row>
            </div>
        );
    }
}

export default addFormFieldValidations(TenantConfig);
