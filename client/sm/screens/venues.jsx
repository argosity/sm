import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import moment from 'moment-timezone';
import { action, computed, observable } from 'mobx';
import { Row, Col } from 'react-flexbox-grid';
import Button from 'grommet/components/Button';
import { Toolbar, SaveButton } from 'hippo/components/toolbar';
import RecordFinder from 'hippo/components/record-finder';
import ScheduleNewIcon from 'grommet/components/icons/base/ScheduleNew';
import {
    Form, Field, FormState, nonBlank, numberValue,
} from 'hippo/components/form';
import Warning from 'hippo/components/warning-notification';
import Asset from 'hippo/components/asset';
import Screen from 'hippo/components/screen';
import Query from 'hippo/models/query';
import Venue from '../models/venue';
import Message from '../models/message';

@observer
export default class Venues extends React.Component {

    static propTypes = {
        screen: PropTypes.instanceOf(Screen.Instance).isRequired,
    }

    @observable venue = new Venue();
    @observable errorMessage = '';
    formState = new FormState()

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

    componentWillMount() {
        this.formState.setFromModel(this.venue);
    }

    @action.bound
    onRecordFound(venue) {
        this.venue = venue;
        this.formState.set(venue);
    }

    @action.bound
    onSave() {
        this.formState.persistTo(this.venue)
            .then(venue => venue.save())
            .then(this.onSaved);
    }

    @action.bound
    onReset() {
        this.venue = new Venue();
        this.formState.reset();
    }

    @observable dt = moment();

    @action.bound
    onSaved(venue) {
        this.errorMessage = venue.errors ? venue.lastServerMessage : '';
        if (!venue.errors) {
            this.formState.set(venue);
        }
    }

    @computed get isSavable() {
        return this.formState.isValid && !this.venue.syncInProgress;
    }

    render() {
        const { screen } = this.props;

        return (
            <Form state={this.formState} tag="div" screen={screen}>
                <Toolbar>
                    <SaveButton
                        model={this.venue}
                        onClick={this.isSavable ? this.onSave : null}
                    />
                    <Button
                        plain
                        icon={<ScheduleNewIcon />}
                        label='Add New Venue'
                        onClick={this.onReset}
                    />

                </Toolbar>
                <Warning message={this.errorMessage} />

                <Row>
                    <RecordFinder
                        model={this.venue}
                        name="code" recordsTitle='Venue' onRecordFound={this.onRecordFound}
                        query={this.query} validate={nonBlank}
                        sm={4} xs={5}
                    />
                    <Field sm={8} xs={7} name="name" validate={nonBlank} />
                </Row>
                <Row>
                    <Field xs={12} sm={8} name="address" />
                    <Field
                        name="message_id" label="Order Confirmation"
                        type="select" collection={Message.all.asOptions}
                        xs={12} sm={4}
                    />
                </Row>
                <Row>
                    <Asset xs={12} sm={6} model={this.venue} name="logo" />
                    <Col sm={6} xs={12}>
                        <Row>
                            <Field
                                type="number" name="capacity" lg={6} xs={12}
                                validate={numberValue} />
                            <Field
                                label="Minutes before show to halt sales"
                                type="number" name="online_sales_halt_mins_before" lg={6} xs={12}
                                validate={numberValue} />
                            <Field
                                name="timezone" type="timezone"
                                label="Time Zone" lg={6} xs={12}
                            />
                        </Row>
                    </Col>
                </Row>
            </Form>
        );
    }

}
