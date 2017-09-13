import React from 'react';
import { action, observable, computed, observe } from 'mobx';
import {
    Form, Field, FormState, nonBlank, numberValue, dateValue, validURL,
} from 'hippo/components/form';
import PropTypes from 'prop-types';
import { Row } from 'react-flexbox-grid';
import { find } from 'lodash';
import { observer }   from 'mobx-react';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import NextIcon from 'grommet/components/icons/base/Next';
import Header   from 'grommet/components/Header';

import SaveButton from 'hippo/components/save-button';
import Asset from 'hippo/components/asset';
import NetworkActivityOverlay from 'hippo/components/network-activity-overlay';
import { observePubSub } from 'hippo/models/pub_sub';

import Venue from '../../models/venue';
import Show from '../../models/show';
import Presenter from '../../models/presenter';
import ShowTimes from './times';

@observer
class EditForm extends React.PureComponent {

    static propTypes = {
        show:      PropTypes.instanceOf(Show).isRequired,
        onComplete: PropTypes.func.isRequired,
        onEditPage: PropTypes.func.isRequired,
    }

    formState = new FormState()

    componentWillUnmount() {
        this.detachVenueObserver();
    }

    componentDidMount() {
        this.formState.setFromModel(this.props.show);
        this.detachVenueObserver = observe(
            this.formState.get('venue_id'), 'value', this.onVenueChange,
        );
        this.nameField.wrappedInstance.focus();
    }

    @action.bound
    onVenueChange({ newValue }) {
        if (!newValue) { return; }
        const venue = find(Venue.sharedCollection, { id: newValue });
        if (venue) {
            this.formState.get('capacity').value = venue.capacity;
            this.formState.get('online_sales_halt_mins_before').value = venue.online_sales_halt_mins_before;
        }
    }

    @observable isEditingPage = false;

    @computed get venues() {
        return Venue.sharedCollection.map(opt => ({ id: opt.id, label: opt.name }));
    }

    @computed get presenters() {
        return Presenter.sharedCollection.map(opt => ({ id: opt.id, label: opt.name }));
    }

    @action.bound
    onSave() {
        if (!this.isSavable) {
            this.formState.exposeErrors();
            return;
        }
        this.formState.persistTo(this.props.show)
            .then(() => this.props.show.save({ include: 'times' }))
            .then(this.onSaved);
    }

    @action.bound
    onSaved() {
        if (this.props.show.isValid) {
            this.onCancel();
        }
    }

    @action.bound
    onCancel() {
        this.props.onComplete();
    }

    @computed get isSavable() {
        return this.formState.isValid && !this.props.show.syncInProgress;
    }

    @action.bound setFieldRef(r) {
        this.nameField = r;
    }

    render() {
        const { show } = this.props;
        observePubSub(show);

        return (
            <div className="show-edit">
                <Header
                    fixed
                    colorIndex="light-2"
                    pad={{ horizontal: 'small', vertical: 'small', between: 'small' }}
                >
                    <SaveButton onClick={this.onSave} model={this.props.show} />

                    <Button label="Cancel" onClick={this.onCancel} accent />
                    <Box flex />
                    <Button
                        label="Edit Page" onClick={show.isNew ? null : this.props.onEditPage} accent
                        icon={<NextIcon />} className="edit-page"
                    />
                </Header>
                <Form className="show-edit-body" tag="div" state={this.formState}>
                    <NetworkActivityOverlay model={show} />

                    <Row>
                        <Field
                            ref={this.setFieldRef}
                            name="title" xs={6} lg={3} validate={nonBlank}
                        />

                        <Field name="sub_title" xs={6} lg={3} />

                        <Field name="description" xs={12} lg={6} />

                        <Field
                            name="venue_id" label="Venue"
                            type="select" collection={this.venues} validate={nonBlank}
                            xs={6} md={4} lg={3}
                        />

                        <Field type="number" name="capacity" validate={numberValue} xs={6} md={4} lg={3} />
                        <Field
                            validate={numberValue}
                            label="Minutes before show to halt sales"
                            type="number" name="online_sales_halt_mins_before"
                            xs={6} md={4} lg={3} />

                        <Field
                            name="presenter_id" label="Presented By"
                            type="select" collection={this.presenters} xs={6} md={4} lg={3}
                        />

                        <Field type="number" name="price" validate={numberValue} xs={6} md={4} lg={3} />

                        <Field
                            type="date" label="Visible After" name="visible_during.start"
                            validate={dateValue} xs={6} md={4} lg={3} />
                        <Field
                            type="date" label="Visible Until" name="visible_during.end"
                            validate={dateValue} xs={6} md={4} lg={3} />

                        <Field type="checkbox" name="can_purchase" xs={6} md={4} lg={3} />

                        <Field
                            name="external_url" xs={6} md={4} lg={3}
                            validate={validURL({ allowBlank: true })} />

                    </Row>
                    <Row>
                        <Asset model={show} name="image" sm={5} xs={12} />
                        <ShowTimes show={show} sm={7} xs={12}/>
                    </Row>
                </Form>
            </div>
        );
    }

}

export default function EditFormWrapper(props) {
    if (!props.show) { return null; }
    return <EditForm {...props} />;
}
