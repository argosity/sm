import React from 'react';
import { action, observable, computed, observe } from 'mobx';
import {
    Form, Field, FormState, nonBlank, numberValue, validURL, FieldsLayout,
} from 'hippo/components/form';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import { observer }   from 'mobx-react';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import { Toolbar, SaveButton } from 'hippo/components/toolbar';
import { Next } from 'grommet-icons';
import styled from 'styled-components';
import Asset from 'hippo/components/asset';
import NetworkActivityOverlay from 'hippo/components/network-activity-overlay';
import { observePubSub } from 'hippo/models/pub_sub';
import Message from '../../models/message';
import Venue from '../../models/venue';
import Show from '../../models/show';
import Presenter from '../../models/presenter';
import ShowTimes from './times';


const EditFormWrapper = styled.div`
height: 100vh;
button.edit-page {
    flex-direction: row-reverse;
    display: flex;
}

.show-edit-body {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 75px);
    overflow-y: auto;
    padding: 0 0.5rem;
    > * {
        min-height: min-content; min-height: -moz-min-content; min-height: -webkit-min-content;
    }
}
.times {
    margin-top: 0.5rem;
    min-height: 250px;
    input {
        max-width: 100%;
        padding: 0;
        border-radius: 1px;
        padding: 3px;
        text-align: right;
        &.flatpickr-input {
            text-align: center;
        }
    }
}`;

@observer
class EditForm extends React.Component {

    static propTypes = {
        show:      PropTypes.instanceOf(Show).isRequired,
        onComplete: PropTypes.func.isRequired,
        onEditPage: PropTypes.func.isRequired,
    }

    formState = new FormState()

    componentDidMount() {
        this.formState.setFromModel(this.props.show);
        // I think we don't need to detach these since the form state
        // will no longer be referenced after this component is unmounted
        observe(this.formState.get('venue_id'), 'value', this.onVenueChange);
        observe(this.formState.get('price'), 'value', this.onPriceChange);
        observe(this.formState.get('capacity'), 'value', this.onCapacityChange);
    }

    @action.bound onPriceChange({ oldValue, newValue }) {
        this.props.show.times.forEach((t) => {
            if (!t.price || t.price === oldValue) {
                t.price = newValue;
            }
        });
    }

    @action.bound onCapacityChange({ oldValue, newValue }) {
        this.props.show.times.forEach((t) => {
            if (!t.capacity || t.capacity === oldValue) {
                t.capacity = newValue;
            }
        });
    }

    @action.bound
    onVenueChange({ newValue }) {
        if (!newValue) { return; }
        const venue = find(Venue.all, { id: newValue });
        if (venue) {
            this.formState.get('capacity').value = venue.capacity;
            this.formState.get('message_id').value = venue.message_id;
            this.formState.get('online_sales_halt_mins_before').value = venue.online_sales_halt_mins_before;
        }
    }

    @observable isEditingPage = false;

    @computed get presenters() {
        return Presenter.all.map(opt => ({ id: opt.id, label: opt.name }));
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
            <EditFormWrapper className="show-edit">
                <Toolbar>
                    <SaveButton onClick={this.onSave} model={this.props.show} />
                    <Button label="Cancel" onClick={this.onCancel} accent />
                    <Box flex />
                    <Button
                        label="Edit Page" onClick={show.isNew ? null : this.props.onEditPage} accent
                        icon={<Next />} className="edit-page"
                    />
                </Toolbar>
                <Form className="show-edit-body" tag="div" state={this.formState}>
                    <NetworkActivityOverlay model={show} />

                    <FieldsLayout>
                        <Field
                            autoFocus
                            ref={this.setFieldRef}
                            name="title" validate={nonBlank} />

                        <Field name="sub_title" />

                        <Field name="description" />

                        <Field
                            name="presenter_id" label="Presented By"
                            type="select" collection={this.presenters} />

                        <Field
                            options={{ enableTime: false, mode: 'range' }}
                            format="M d Y"
                            type="date" label="Visible" name="visible_during" />

                        <Field type="checkbox" name="can_purchase" label="Purchasable?" />

                        <Field type="number" name="price" validate={numberValue} />

                        <Field
                            name="external_url"
                            validate={validURL({ allowBlank: true })} />

                        <Field
                            name="venue_id" label="Venue"
                            type="select" collection={Venue.all.asOptions}
                            validate={nonBlank} />

                        <Field type="number" name="capacity" validate={numberValue} />

                        <Asset model={show} name="image" />

                        <ShowTimes show={show} height={3} />

                        <Field
                            validate={numberValue}
                            label="Halt minutes"
                            type="number" name="online_sales_halt_mins_before" />

                        <Field
                            name="message_id" label="Order Messages"
                            type="select" collection={Message.all.asOptions} />

                        <Field
                            label="Instructions on tickets"
                            height={2} type="textarea" name="ticket_instructions" />
                    </FieldsLayout>

                </Form>
            </EditFormWrapper>
        );
    }

}

export default function EditFormMounter(props) {
    if (!props.show) { return null; }
    return <EditForm {...props} />;
}
