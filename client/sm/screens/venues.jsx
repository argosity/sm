import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import moment from 'moment-timezone';
import { action, computed, observable } from 'mobx';
import { Row, Col } from 'react-flexbox-grid';
import Header   from 'grommet/components/Header';
import Button   from 'grommet/components/Button';
import SaveIcon from 'grommet/components/icons/base/Save';
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

@observer
export default class Venues extends React.PureComponent {
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
            <Screen screen={screen}>
                <Form state={this.formState} tag="div">
                    <Header colorIndex="light-2" align="center" pad={{ between: 'small' }} fixed>
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
                            name="code" recordsTitle='Venue' onRecordFound={this.onRecordFound}
                            query={this.query} xs={4} validate={nonBlank}
                        />
                        <Field xs={8} name="name" validate={nonBlank} />
                    </Row>
                    <Row>
                        <Field xs={12} name="address" />
                    </Row>
                    <Row>
                        <Asset xs={12} sm={6} model={this.venue} name="logo" />
                        <Col lg={9} xs={6}>
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
            </Screen>
        );
    }
}
