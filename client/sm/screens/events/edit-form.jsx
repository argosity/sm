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
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import DocumentTextIcon from 'grommet/components/icons/base/DocumentText';
import SaveIcon from 'grommet/components/icons/base/Save';

import Asset from 'hippo/components/asset';
import NetworkActivityOverlay from 'hippo/components/network-activity-overlay';
import { observePubSub } from 'hippo/models/pub_sub';

import PageEditor from './page-editor';
import Venue from '../../models/venue';
import Event from '../../models/event';
import Presenter from '../../models/presenter';
import Occurrences from './occurrences';

@observer
export default class EditForm extends React.PureComponent {
    static propTypes = {
        event:      PropTypes.instanceOf(Event).isRequired,
        onComplete: PropTypes.func.isRequired,
    }

    formState = new FormState()

    componentWillUnmount() {
        this.detachVenueObserver();
    }

    componentDidMount() {
        this.formState.setFromModel(this.event);
        this.detachVenueObserver = observe(
            this.formState.get('venue_id'), 'value', this.onVenueChange,
        );
    }

    @action.bound
    onVenueChange({ newValue }) {
        if (!newValue) { return; }
        const venue = find(Venue.sharedCollection, { id: newValue });
        if (venue) {
            this.formState.get('capacity').value = venue.capacity;
        }
    }

    @observable isEditingPage = false;

    @computed get venues() {
        return Venue.sharedCollection.map(opt => ({ id: opt.id, label: opt.name }));
    }

    @computed get presenters() {
        return Presenter.sharedCollection.map(opt => ({ id: opt.id, label: opt.name }));
    }

    @computed get event() {
        return this.props.event;
    }

    @action.bound
    onSave() {
        if (!this.isSavable) {
            this.formState.exposeErrors();
            return;
        }
        this.formState.persistTo(this.event)
            .then(() => this.event.save({ include: 'occurrences' }))
            .then(this.onSaved);
    }

    @action.bound
    onSaved() {
        if (this.event.isValid) {
            this.onCancel();
        }
    }

    @action.bound
    onCancel() {
        this.props.onComplete();
    }

    @action.bound
    editPage() {
        this.isEditingPage = true;
    }

    @computed get isSavable() {
        return this.formState.isValid && !this.event.syncInProgress;
    }

    @action.bound
    onPageEditComplete() {
        this.isEditingPage = false;
    }

    renderPage() {
        if (!this.isEditingPage) { return null; }
        return (
            <PageEditor
                onComplete={this.onPageEditComplete}
                event={this.event}
            />
        );
    }

    render() {
        const { event, props: { style } } = this;
        observePubSub(event);

        return (
            <Box
                separator='horizontal'
                pad={{ vertical: 'medium' }}
                className="event-edit-form"
                style={{ ...style, height: 'auto' }}
            >
                <NetworkActivityOverlay model={event} />
                {this.renderPage()}
                <Form tag="div" state={this.formState}>
                    <Row>
                        <Field name="title" xs={6} lg={3} validate={nonBlank} />
                        <Field name="sub_title" xs={6} lg={3} />
                        <Field name="description" xs={12} lg={6} />
                        <Field
                            name="venue_id" label="Venue" xs={6} lg={3}
                            type="select" collection={this.venues} validate={nonBlank}
                        />
                        <Field
                            name="presenter_id" label="Presented By" xs={6} lg={3}
                            type="select" collection={this.presenters}
                        />

                        <Field type="number" name="price" xs={6} lg={3} validate={numberValue} />
                        <Field type="number" name="capacity" xs={6} lg={3} validate={numberValue} />
                        <Field
                            type="date" label="Visible After" name="visible_during.start"
                            xs={6} lg={3} validate={dateValue} />
                        <Field
                            type="date" label="Visible Until" name="visible_during.end"
                            xs={6} lg={3} validate={dateValue} />
                        <Field
                            name="external_url" xs={12} lg={6}
                            validate={validURL({ allowBlank: true })} />

                    </Row>
                    <Row>
                        <Asset model={event} name="image" md={5} sm={12} />

                        <Occurrences event={event} md={7} sm={12}/>

                    </Row>
                </Form>
                <Footer
                    margin="small"
                    justify="end"
                    pad={{ horizontal: 'small', between: 'small' }}
                >
                    <Button
                        label="Edit Page" onClick={event.isNew ? null : this.editPage} accent
                        icon={<DocumentTextIcon />}
                    />
                    <Button label="Cancel" onClick={this.onCancel} accent />
                    <Button
                        label="Save"
                        icon={<SaveIcon />}
                        onClick={this.onSave}
                        primary
                    />

                </Footer>

            </Box>
        );
    }
}
