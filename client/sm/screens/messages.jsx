import React from 'react';
import { observer } from 'mobx-react';
import { pick } from 'lodash';
import moment from 'moment-timezone';
import { action, computed, observable } from 'mobx';
import { Box, Button } from 'grommet';
import { ClearOption } from 'grommet-icons';
import Help from 'hippo/components/help';
import RecordFinder from 'hippo/components/record-finder';
import {
    Form, Field, FormState, nonBlank, FieldsLayout,
} from 'hippo/components/form';
import { Toolbar, SaveButton } from 'hippo/components/toolbar';
import Warning from 'hippo/components/warning-notification';
import Asset from 'hippo/components/asset';
import Query from 'hippo/models/query';
import Message from '../models/message';

@observer
export default class Messages extends React.Component {

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
                <Toolbar>
                    <SaveButton
                        model={this.message}
                        onClick={this.isSavable ? this.onSave : null} />

                    <Button
                        icon={<ClearOption />}
                        label='Clear'
                        onClick={this.onReset} />

                    <Button onClick={this.setDefaultMessages} label="Set Defaults" />
                    <Toolbar.expand />
                    <Help
                        position="top-end"
                        message="If left blank, email fields will use the defaults.  Click “Set Defaults” to copy the current default to the fields so it can be customized"
                    />
                </Toolbar>
                <Warning message={this.errorMessage} />

                <FieldsLayout>
                    <RecordFinder
                        model={this.message}
                        name="code" recordsTitle='Message' onRecordFound={this.onRecordFound}
                        query={this.query} validate={nonBlank}
                    />
                    <Field tablet="2" name="name" validate={nonBlank} />
                    <Asset
                        model={this.message} name="ticket_header"
                    />
                    <Asset
                        model={this.message} name="ticket_footer"
                    />

                </FieldsLayout>

                <Box margin="small" flex>
                    <Field
                        label="Order confirmation email subject"
                        name="order_confirmation_subject"
                    />

                    <Field
                        flex
                        type="textarea"
                        name="order_confirmation_body"
                        label="Source for order confirmation email"
                    />
                </Box>
            </Form>
        );
    }

}
