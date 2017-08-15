import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import moment from 'moment';
import { Row, Col } from 'react-flexbox-grid';
import Screen from 'hippo/components/screen';
import Query from 'hippo/models/query';
import RecordFinder from 'hippo/components/record-finder';
import EventOccurrence from '../models/event_occurrence';
import Box from 'grommet/components/Box';
import Attendees from './box-office/attendees';
import './box-office/box-office.scss';

const DateCell = ({ cellData }) => moment(cellData).format('YYYY-MM-DD hh:mma');


import {
    Form, Field, FormState, nonBlank, numberValue,
} from 'hippo/components/form';
import Occurrence from '../models/event_occurrence';

@observer
export default class BoxOffice extends React.PureComponent {

    static propTypes = {
        screen: PropTypes.instanceOf(Screen.Instance).isRequired,
    }

    @observable occurrence = new EventOccurrence;

    formState = new FormState()

    query = new Query({
        src: Occurrence,
        syncOptions: { include: 'event', order: { occurs_at: 'desc' } },
        fields: [
            { id: 'id', visible: false, queryable: false },
            { id: 'events.title', label: 'Title', flexGrow: 1 },
            { id: 'occurs_at', cellRenderer: DateCell, flexGrow: 0, width: 160, textAlign: 'right' },
        ],
    })

    @action.bound
    onRecordFound(occur) {
        this.occurrence = occur;
        this.formState.set(occur);
    }

    render() {
        const { occurrence } = this;

        return (
            <Screen screen={this.props.screen}>
                <Form state={this.formState} tag="div">
                    <Row>
                        <RecordFinder
                            sm={6}
                            name="event.title" recordsTitle='Event' label="Event"
                            onRecordFound={this.onRecordFound}
                            query={this.query} xs={4} validate={nonBlank}
                        />
                        <Box justify="center">
                            {occurrence.isNew ? '' : moment(occurrence.occurs_at).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                        </Box>
                    </Row>
                </Form>

                <Attendees occurrence={occurrence} />
            </Screen>
        );
    }
}
