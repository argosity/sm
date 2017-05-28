import { action, observable, computed, observe } from 'mobx';

import {
    Form, Field, FormState, nonBlank, numberValue, stringValue, field, dateValue, validURL,
} from 'hippo/components/form';

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { find } from 'lodash';
import { observer }   from 'mobx-react';
import Box from 'grommet/components/Box';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import DocumentTextIcon from 'grommet/components/icons/base/DocumentText';
import SaveIcon from 'grommet/components/icons/base/Save';

import Asset from 'hippo/components/asset';
import NetworkActivityOverlay from 'hippo/components/network-activity-overlay';

import PageEditor from './page-editor';
import Venue from '../../models/venue';
import Event from '../../models/event';
import Presenter from '../../models/presenter';

@observer
export default class EditForm extends React.PureComponent {

    static propTypes = {
        event:      PropTypes.instanceOf(Event).isRequired,
        onComplete: PropTypes.func.isRequired,
    }

    static desiredHeight = 300

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
            this.formFields.get('capacity').value = venue.capacity;
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
        this.formState.persistTo(this.event)
            .then(() => this.event.save())
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
                        <Field type="number" name="price" xs={6} lg={3}
                            validate={numberValue} />
                        <Field type="number" name="capacity" xs={6} lg={3}
                            validate={numberValue} />
                        <Field type="date" name="visible_after" lg={3} xs={6}
                            validate={dateValue} />
                        <Field type="date" name="visible_until" lg={3} xs={6}
                            validate={dateValue} />
                        <Field type="date" name="onsale_after" lg={3} xs={6}
                            validate={dateValue} />
                        <Field type="date" name="onsale_until" lg={3} xs={6}
                            validate={dateValue} />
                    </Row>
                    <Row>
                        <Asset model={event} name="image" md={6} sm={12} />
                        <Col md={6} xs={12}>
                            <Row>
                                <Field
                                    type="date" name="occurs_at" sm={12} xs={6}
                                    validate={dateValue} />

                                <Field
                                    name="external_url" sm={12} xs={6}
                                    validate={validURL({ allowBlank: true })} />

                                <Field
                                    name="venue_id" label="Venue" sm={12} xs={6}
                                    type="select" collection={this.venues} validate={nonBlank}
                                />
                                <Field
                                    name="presenter_id" label="Presented By" sm={12} xs={6}
                                    type="select" collection={this.presenters}
                                />
                            </Row>
                        </Col>
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
                        onClick={this.isSavable ? this.onSave : null}
                        primary
                    />

                </Footer>

            </Box>
        );
    }
}
