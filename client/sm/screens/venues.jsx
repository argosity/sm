import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import { forIn } from 'lodash';
import { Row, Col } from 'react-flexbox-grid';
import Screen from 'lanes/components/screen';
import Query from 'lanes/models/query';
import RecordFinder from 'lanes/components/record-finder';
import Header   from 'grommet/components/Header';
import Button   from 'grommet/components/Button';
import SaveIcon from 'grommet/components/icons/base/Save';
import ScheduleNewIcon from 'grommet/components/icons/base/ScheduleNew';
import Warning from 'lanes/components/warning-notification';
import Asset from 'lanes/components/asset';

import {
    Form, Field, FieldDefinitions, nonBlank, numberValue, stringValue,
} from 'lanes/components/form';

import Venue from '../models/venue';

@observer
export default class Venues extends React.PureComponent {

    static propTypes = {
        screen: PropTypes.instanceOf(Screen.Instance).isRequired,
    }

    formFields = new FieldDefinitions({
        code: stringValue,
        name: nonBlank,
        address: stringValue,
        capacity: numberValue,
    })

    query = new Query({
        src: Venue,
        autoFetch: true,
        syncOptions: { include: 'logo' },
        fields: [
            { id: 'id', visible: false, queryable: false },
            'code',
            { id: 'name', width: 200 },
            { id: 'address', width: 300 },
        ],
    })

    @observable venue = new Venue();
    @observable errorMessage = '';

    @action.bound
    onRecordFound(venue) {
        this.venue = venue;
        this.formFields.set(venue);
    }

    @action.bound
    onSave() {
        this.formFields.persistTo(this.venue)
            .then(venue => venue.save())
            .then(this.onSaved);
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
            this.formFields.set(venue);
        }
    }

    @computed get isSavable() {
        return this.formFields.isValid && !this.venue.syncInProgress;
    }

    render() {
        const { fields, screen } = this.props;

        return (
            <Screen screen={screen}>
                <Form fields={this.formFields} tag="div">
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
                            query={this.query} name="code"
                            autoFocus
                        />
                        <Field xs={8} name="name" />
                    </Row>
                    <Row>
                        <Field xs={12} name="address"  />
                    </Row>
                    <Row>
                        <Asset xs={12} sm={6} model={this.venue} name="logo" />
                        <Col lg={9} xs={6}>
                            <Row>
                                <Field type="number" name="capacity" lg={6} xs={12} />
                            </Row>
                        </Col>

                    </Row>
                </Form>
            </Screen>
        );
    }
}
