import React from 'react';
import { Row } from 'react-flexbox-grid';


import { isNil, forIn, get } from 'lodash';

import { observer }   from 'mobx-react';
import { action, observable, computed } from 'mobx';

import Button    from 'grommet/components/Button';
import Warning from 'lanes/components/warning-notification';
import Field from 'lanes/components/form-field';

import { addFormFieldValidations, validEmail, nonBlank, validation } from 'lanes/lib/form-validation';
import Query from 'lanes/models/query';


@observer
class EditForm extends React.PureComponent {

    static propTypes = {
        query:      React.PropTypes.instanceOf(Query).isRequired,
        index:      React.PropTypes.number.isRequired,
        onComplete: React.PropTypes.func.isRequired,
        fields: React.PropTypes.shape({
            title: React.PropTypes.object,
        }).isRequired,
        formState: React.PropTypes.shape({
            touchd: React.PropTypes.bool,
            valid:  React.PropTypes.bool,
        }).isRequired,
        setDefaultValues: React.PropTypes.func.isRequired,
    }

    static desiredHeight = 300

    static formValidations = {
        title: nonBlank,
    }

    constructor(props) {
        super(props);
        this.event = this.props.query.results.modelForRow(this.props.index);
    }

    componentDidMount() {
        this.props.setDefaultValues(this.event.serialize());
    }

    @action.bound
    onSave() {
        forIn(this.props.fields, (field, name) => (this.event[name] = field.value));
        this.event.save().then(this.onSaved);
    }

    @action.bound
    onSaved(event) {
        if (event.errors) {
            this.errorMessage = event.lastServerMessage;
        } else {
            this.props.onComplete();
        }
    }

    @action.bound
    onCancel() {
        this.props.onComplete();
    }

    @observable
    errorMessage = ''


    @computed get isSavable() {
        return this.props.formState.valid && !this.event.syncInProgress;
    }


    render() {
        const {
            fields: { title },
        } = this.props;

        return (
            <div className="event-edit-form" style={this.props.style}>
                <Warning message={this.errorMessage} />
                <Row middle='sm'>
                    <Field md={8} xs={12} name="title" field={title} />
                </Row>
            </div>
        );
    }
}

export default addFormFieldValidations(EditForm, 'desiredHeight');
