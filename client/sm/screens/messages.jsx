import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import moment from 'moment-timezone';
import { action, computed, observable } from 'mobx';
import { Row, Col } from 'react-flexbox-grid';
import Header   from 'grommet/components/Header';
import Button   from 'grommet/components/Button';

import RecordFinder from 'hippo/components/record-finder';
import ScheduleNewIcon from 'grommet/components/icons/base/ScheduleNew';
import {
    Form, Field, FormState, nonBlank,
} from 'hippo/components/form';
import SaveButton from 'hippo/components/save-button';
import Warning from 'hippo/components/warning-notification';
import Asset from 'hippo/components/asset';
import Screen from 'hippo/components/screen';
import Query from 'hippo/models/query';
import Message from '../models/message';

@observer
export default class Messages extends React.PureComponent {

    @observable message = new Message();
    @observable errorMessage = '';
    formState = new FormState()

    query = new Query({
        src: Message,
        autoFetch: true,
        syncOptions: { include: ['ticket_header', 'ticket_footer'] },
        fields: [
            { id: 'id', visible: false, queryable: false },
            'code', 'name',
        ],
    })

    componentWillMount() {
        this.message.fetchDefaults();
        this.formState.setFromModel(this.message);
    }

    @action.bound
    onRecordFound(message) {
        this.message = message;
        this.formState.set(message);
    }

    @action.bound
    onSave() {
        this.formState.persistTo(this.message)
            .then(message => message.save())
            .then(this.onSaved);
    }

    @action.bound
    onReset() {
        this.message = new Message();
        this.formState.reset();
    }

    @observable dt = moment();

    @action.bound
    onSaved(message) {
        this.errorMessage = message.errors ? message.lastServerMessage : '';
        if (!message.errors) {
            this.formState.set(message);
        }
    }

    @computed get isSavable() {
        return this.formState.isValid && !this.message.syncInProgress;
    }

    render() {
        return (
            <Form state={this.formState} tag="div" {...this.props}>
                <Header colorIndex="light-2" align="center" pad={{ between: 'small' }} fixed>
                    <SaveButton
                        model={this.message}
                        onClick={this.isSavable ? this.onSave : null}
                    />
                    <Button
                        plain
                        icon={<ScheduleNewIcon />}
                        label='Add New Message'
                        onClick={this.onReset}
                    />

                </Header>
                <Warning message={this.errorMessage} />

                <Row>
                    <RecordFinder
                        name="code" recordsTitle='Message' onRecordFound={this.onRecordFound}
                        query={this.query} xs={4} validate={nonBlank}
                    />
                    <Field xs={8} name="name" validate={nonBlank} />
                </Row>
                <Row>
                    <Asset
                        xs={12} sm={6} model={this.message} name="ticket_header"
                    />
                    <Asset
                        xs={12} sm={6} model={this.message} name="ticket_footer"
                    />
                </Row>
                <Row>
                    <Field
                        label="Order confirmation email subject"
                        xs={12} name="order_confirmation_subject"
                    />
                </Row>
                <Row style={{ flex: 1 }}>
                    <Field
                        label="Source for order confirmation email"
                        style={{ height: '100%', minHeight: '300px' }}
                        type="textarea" name="order_confirmation_body"
                        xs={12}
                    />
                </Row>
            </Form>
        );
    }

}
