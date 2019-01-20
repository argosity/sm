import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import { Button } from 'grommet';
import Screen from 'hippo/components/screen';
import Query from 'hippo/models/query';
import RecordFinder from 'hippo/components/record-finder';
import { Toolbar, SaveButton } from 'hippo/components/toolbar';
import { ClearOption } from 'grommet-icons';
import Warning from 'hippo/components/warning-notification';
import Asset from 'hippo/components/asset';
import {
    Form, Field, FormState, nonBlank, FieldsLayout,
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
            .then(() => this.presenter.sync.save())
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
        return this.formState.isValid && !this.presenter.sync.isBusy;
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
                        icon={<ClearOption />}
                        label='Clear'
                        onClick={this.onReset}
                    />
                </Toolbar>
                <FieldsLayout>
                    <Warning message={this.presenter.errorMessage} />
                    <RecordFinder
                        model={this.presenter}
                        tabIndex={1}
                        recordsTitle='Presenter'
                        onRecordFound={this.onRecordFound}
                        query={this.query} name="code"
                        validate={nonBlank}
                        autoFocus
                    />
                    <Field name="name" validate={nonBlank} tabIndex={2} />
                    <Asset model={this.presenter} name="logo" tabIndex={3} />
                </FieldsLayout>
            </Form>
        );
    }

}
