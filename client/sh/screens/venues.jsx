import React from 'react';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import { forIn } from 'lodash';
import { Row } from 'react-flexbox-grid';
import Screen from 'lanes/components/screen';
import Query from 'lanes/models/query';
import RecordFinder from 'lanes/components/record-finder';
import Field from 'lanes/components/form-field';
import Header   from 'grommet/components/Header';
import Footer   from 'grommet/components/Footer';
import Button   from 'grommet/components/Button';
import SaveIcon from 'grommet/components/icons/base/Save';
import ScheduleNewIcon from 'grommet/components/icons/base/ScheduleNew';
import Warning from 'lanes/components/warning-notification';
import Asset from 'lanes/components/asset'

import {
    addFormFieldValidations, nonBlank, stringValue, setFieldValues,
} from 'lanes/lib/forms';

import Venue from '../models/venue';

@observer
class Venues extends React.PureComponent {

    static propTypes = {
        fields: React.PropTypes.object.isRequired,
        screen: React.PropTypes.instanceOf(Screen.Instance).isRequired,
    }

    static formFields = {
        code: stringValue,
        name: nonBlank,
        address: stringValue,
    }

    query = new Query({
        src: Venue,
        syncOptions: { include: 'logo' },
        fields: [
            { id: 'id', visible: false, queryable: false },
            'code',
            { id: 'name', width: 200 },
            { id: 'address', width: 300 },
        ],
    })

    @observable venue = new Venue();
    @observable errorMessage = ''

    @action.bound
    onRecordFound(venue) {
        this.venue = venue;
        this.props.setDefaultValues(venue.serialize())
        setFieldValues(this.props.fields, venue.serialize());
    }

    @action.bound
    onSave() {
        forIn(this.props.fields, (field, name) => (this.venue[name] = field.value));
        this.venue.save().then(this.onSaved);
    }

    @action.bound
    onReset() {
        this.venue = new Venue();
        this.props.clearForm();
    }

    @action.bound
    onSaved(venue) {
        this.errorMessage = venue.errors ? venue.lastServerMessage : '';
        if (!venue.errors) {
            setFieldValues(this.props.fields, venue.serialize());
        }
    }

    @computed get isSavable() {
        return this.props.formState.valid && !this.venue.syncInProgress;
    }

    render() {
        const { fields, screen } = this.props;

        return (
            <Screen screen={screen}>
                <Header colorIndex="light-2" align="center" pad={{ between: 'small' }}>
                    <Button
                        primary
                        icon={<SaveIcon />}
                        label='Save'
                        onClick={this.isSavable ? this.onSave : null}
                    />
                    <Button
                        plain
                        icon={<ScheduleNewIcon />}
                        label='Add New Venue'
                        onClick={this.onReset}
                    />

                </Header>
                <Warning message={this.errorMessage} />
                <Row>
                    <RecordFinder
                        xs={4}
                        recordsTitle='Venue'
                        onRecordFound={this.onRecordFound}
                        query={this.query} fields={fields} name="code"
                        autoFocus
                    />
                    <Field xs={8} name="name" fields={fields} />
                </Row>
                <Row>
                    <Field xs={12} name="address" fields={fields} />
                </Row>
                <Row>
                    <Asset xs={12} sm={6} model={this.venue} name="logo" />
                </Row>
            </Screen>
        );
    }
}

export default addFormFieldValidations(Venues);
