import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import { Box, Button } from 'grommet';
import { Grid } from 'grommet';

import Screen from 'hippo/components/screen';
import Query from 'hippo/models/query';
import RecordFinder from 'hippo/components/record-finder';
import { Toolbar, SaveButton } from 'hippo/components/toolbar';
import { ScheduleNew } from 'grommet-icons';
import Warning from 'hippo/components/warning-notification';
import Asset from 'hippo/components/asset';
import {
    Form, Field, FormState, nonBlank,
} from 'hippo/components/form';


import Presenter from '../models/presenter';

@observer
export default class Presenters extends React.Component {

    static propTypes = {
        screen: PropTypes.instanceOf(Screen.Instance).isRequired,
    }

    formState = new FormState()

    query = new Query({
        src: Presenter,
        autoFetch: true,
        syncOptions: { include: 'logo' },
        fields: [
            { id: 'id', visible: false, queryable: false },
            'code',
            { id: 'name' },
        ],
    })

    @observable presenter = new Presenter();

    @action.bound
    onRecordFound(presenter) {
        this.presenter = presenter;
        this.formState.set(presenter);
    }

    @action.bound
    onSave() {
        this.formState.persistTo(this.presenter)
            .then(() => this.presenter.save())
            .then(this.onSaved);
    }

    @action.bound
    onReset() {
        this.presenter = new Presenter();
        this.formState.set(this.presenter);
    }

    @action.bound
    onSaved(presenter) {
        if (!presenter.errors) {
            this.formState.set(presenter);
        }
    }

    @computed get isSavable() {
        return this.formState.isValid && !this.presenter.syncInProgress;
    }

    render() {
        const { screen } = this.props;

        return (
            <Form screen={screen} state={this.formState}>
                <Toolbar>
                    <SaveButton
                        tabIndex={4}
                        model={this.presenter}
                        onClick={this.isSavable ? this.onSave : null}
                    />
                    <Button
                        plain
                        icon={<ScheduleNew />}
                        label='Add New Presenter'
                        onClick={this.onReset}
                    />
                </Toolbar>
                <Grid columns={['full']} justifyContent="start" alignContent="start">
                    <Warning message={this.presenter.errorMessage} />

                    <RecordFinder
                        model={this.presenter}
                        tabIndex={1}
                        recordsTitle='Presenter'
                        onRecordFound={this.onRecordFound}
                        query={this.query} name="code"
                        validate={nonBlank}
                        autoFocus
                        sm={4} xs={5}
                    />
                    <Field sm={8} xs={7} name="name" validate={nonBlank} tabIndex={2} />
                    <Asset xs={12} sm={6} model={this.presenter} name="logo" tabIndex={3} />
                </Grid>
            </Form>
        );
    }
}
