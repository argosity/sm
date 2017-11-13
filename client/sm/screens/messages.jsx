import React from 'react';
import { observer } from 'mobx-react';
import { pick } from 'lodash';
import moment from 'moment-timezone';
import { action, computed, observable } from 'mobx';
import { Row } from 'react-flexbox-grid';
import Header   from 'grommet/components/Header';
import Box      from 'grommet/components/Box';
import Button   from 'grommet/components/Button';
import Help from 'hippo/components/help';
import RecordFinder from 'hippo/components/record-finder';
import ScheduleNewIcon from 'grommet/components/icons/base/ScheduleNew';
import {
    Form, Field, FormState, nonBlank,
} from 'hippo/components/form';
import SaveButton from 'hippo/components/save-button';
import Warning from 'hippo/components/warning-notification';
import Asset from 'hippo/components/asset';
import Query from 'hippo/models/query';
import Message from '../models/message';

@observer
export default class Messages extends React.PureComponent {

    @observable defaultMessage = new Message();
    @observable message;
    @observable errorMessage = '';
    formState = new FormState();

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
        this.defaultMessage.fetchDefaults();
        this.onReset();
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
        this.formState.setFromModel(this.message);
    }

    @action.bound
    setDefaultMessages() {
        this.formState.update(
            pick(
                this.defaultMessage,
                'order_confirmation_subject',
                'order_confirmation_body',
            ),
        );
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
                        model={this.message}
                        name="code" recordsTitle='Message' onRecordFound={this.onRecordFound}
                        query={this.query} validate={nonBlank}
                        sm={4} xs={5}
                    />
                    <Field sm={8} xs={7} name="name" validate={nonBlank} />
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
                        xs={9} name="order_confirmation_subject"
                    />

                    <Box
                        flex direction="row" justify="around"
                        align="center" alignContent="center"
                    >
                        <Help
                            position="top-end"
                            message="If left blank, email fields will use the defaults.  Click “Set Defaults” to copy the current default to the fields so it can be customized"
                        />
                        <Button onClick={this.setDefaultMessages} label="Set Defaults" />
                    </Box>

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
