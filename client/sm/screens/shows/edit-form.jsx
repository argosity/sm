import React from 'react';
import { action, observable, computed, observe } from 'mobx';
import {
    Form, Field, FormState, nonBlank, numberValue, validURL,
} from 'hippo/components/form';
import PropTypes from 'prop-types';
import { Row } from 'react-flexbox-grid';
import { find } from 'lodash';
import { observer }   from 'mobx-react';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import NextIcon from 'grommet/components/icons/base/Next';
import { Toolbar, SaveButton } from 'hippo/components/toolbar';
import Asset from 'hippo/components/asset';
import NetworkActivityOverlay from 'hippo/components/network-activity-overlay';
import { observePubSub } from 'hippo/models/pub_sub';
import Message from '../../models/message';
import Venue from '../../models/venue';
import Show from '../../models/show';
import Presenter from '../../models/presenter';
import ShowTimes from './times';

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
        this.nameField.wrappedInstance.focus();
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
            <div className="show-edit">
                <Toolbar>
                    <SaveButton onClick={this.onSave} model={this.props.show} />

                    <Button label="Cancel" onClick={this.onCancel} accent />
                    <Box flex />
                    <Button
                        label="Edit Page" onClick={show.isNew ? null : this.props.onEditPage} accent
                        icon={<NextIcon />} className="edit-page"
                    />
                </Toolbar>
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
                            name="presenter_id" label="Presented By"
                            type="select" collection={this.presenters} xs={6} md={4} lg={3} />

                        <Field
                            options={{ enableTime: false, mode: 'range' }}
                            format="M d Y"
                            type="date" label="Visible" name="visible_during"
                            xs={6} md={4} lg={3} />

                        <Field type="checkbox" name="can_purchase" label="Purchasable?" xs={6} md={4} lg={3} />

                        <Field type="number" name="price" validate={numberValue} xs={6} md={4} lg={3} />

                        <Field
                            name="external_url" xs={6} md={4} lg={3}
                            validate={validURL({ allowBlank: true })} />

                        <Field
                            name="venue_id" label="Venue"
                            type="select" collection={Venue.all.asOptions} validate={nonBlank}
                            xs={6} md={4} lg={3} />

                    </Row>

                    <Row>
                        <Asset model={show} name="image" sm={5} xs={12} />
                        <ShowTimes show={show} sm={7} xs={12}/>
                    </Row>
                    <Row>

                        <Field
                            type="number" name="capacity" validate={numberValue}
                            xs={4} />

                        <Field
                            validate={numberValue}
                            label="Halt minutes"
                            type="number" name="online_sales_halt_mins_before"
                            xs={4} />

                        <Field
                            name="message_id" label="Order Messages"
                            type="select" collection={Message.all.asOptions}
                            xs={4} />

                    </Row>
                    <Row>
                        <Field
                            label="Instructions on tickets"
                            style={{ height: '100%', minHeight: '300px' }}
                            type="textarea" name="ticket_instructions"
                            xs={12}
                        />
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
