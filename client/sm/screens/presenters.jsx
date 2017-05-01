import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import { forIn } from 'lodash';
import { Row, Col } from 'react-flexbox-grid';
import Screen from 'lanes/components/screen';
import Query from 'lanes/models/query';
import RecordFinder from 'lanes/components/record-finder';
import Field from 'lanes/components/form-field';
import Header   from 'grommet/components/Header';
import Button   from 'grommet/components/Button';
import SaveIcon from 'grommet/components/icons/base/Save';
import ScheduleNewIcon from 'grommet/components/icons/base/ScheduleNew';
import Warning from 'lanes/components/warning-notification';
import Asset from 'lanes/components/asset';

import {
    addFormFieldValidations, nonBlank, stringValue, setFieldValues, persistFieldValues,
} from 'lanes/lib/forms';

import Presenter from '../models/presenter';

@observer
class Presenters extends React.PureComponent {

    static propTypes = {
        fields: PropTypes.object.isRequired,
        screen: PropTypes.instanceOf(Screen.Instance).isRequired,
    }

    static formFields = {
        code: stringValue,
        name: nonBlank,
    }

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
        setFieldValues(this.props, presenter);
    }

    @action.bound
    onSave() {
        persistFieldValues(this.props.fields, this.presenter)
            .then(() => this.presenter.save())
            .then(this.onSaved);
    }

    @action.bound
    onReset() {
        this.presenter = new Presenter();
        this.props.clearForm();
    }

    @action.bound
    onSaved(presenter) {
        if (!presenter.errors) {
            setFieldValues(this.props, presenter);
        }
    }

    @computed get isSavable() {
        return this.props.formState.valid && !this.presenter.syncInProgress;
    }

    render() {
        const { fields, screen } = this.props;

        return (
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
                        query={this.query} fields={fields} name="code"
                        autoFocus
                    />
                    <Field xs={8} name="name" fields={fields} />
                </Row>
                <Row>
                    <Asset xs={12} sm={6} model={this.presenter} name="logo" />
                </Row>
            </Screen>
        );
    }
}

export default addFormFieldValidations(Presenters);
