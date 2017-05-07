import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';

import { Row } from 'react-flexbox-grid';
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
    Form, Field, FieldDefinitions, nonBlank,
} from 'lanes/components/form';


import Presenter from '../models/presenter';

@observer
export default class Presenters extends React.PureComponent {

    static propTypes = {
        screen: PropTypes.instanceOf(Screen.Instance).isRequired,
    }

    formFields = new FieldDefinitions({
        code: nonBlank,
        name: nonBlank,
    })

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
        this.formFields.set(presenter);
    }

    @action.bound
    onSave() {
        this.formFields.persistTo(this.presenter)
            .then(() => this.presenter.save())
            .then(this.onSaved);
    }

    @action.bound
    onReset() {
        this.presenter = new Presenter();
        this.formFields.set(this.presenter);
    }

    @action.bound
    onSaved(presenter) {
        if (!presenter.errors) {
            this.formFields.set(presenter);
        }
    }

    @computed get isSavable() {
        return this.formFields.isValid && !this.presenter.syncInProgress;
    }

    render() {
        const { screen } = this.props;

        return (
            <Form fields={this.formFields}>
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
                            label='Add New Presenter'
                            onClick={this.onReset}
                        />

                    </Header>
                    <Warning message={this.presenter.errorMessage} />
                    <Row>
                        <RecordFinder
                            xs={4}
                            recordsTitle='Presenter'
                            onRecordFound={this.onRecordFound}
                            query={this.query} name="code"
                            autoFocus
                        />
                        <Field xs={8} name="name" />
                    </Row>
                    <Row>
                        <Asset xs={12} sm={6} model={this.presenter} name="logo" />
                    </Row>
                </Screen>
            </Form>
        );
    }
}
