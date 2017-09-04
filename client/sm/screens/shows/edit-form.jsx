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
import Show from '../../models/show';
import Presenter from '../../models/presenter';
import ShowTimes from './times';

@observer
export default class EditForm extends React.PureComponent {
    static propTypes = {
        show:      PropTypes.instanceOf(Show).isRequired,
        onComplete: PropTypes.func.isRequired,
    }

    formState = new FormState()

    componentWillUnmount() {
        this.detachVenueObserver();
    }

    componentDidMount() {
        this.formState.setFromModel(this.show);
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

    @computed get show() {
        return this.props.show;
    }

    @action.bound
    onSave() {
        if (!this.isSavable) {
            this.formState.exposeErrors();
            return;
        }
        this.formState.persistTo(this.show)
            .then(() => this.show.save({ include: 'times' }))
            .then(this.onSaved);
    }

    @action.bound
    onSaved() {
        if (this.show.isValid) {
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
        return this.formState.isValid && !this.show.syncInProgress;
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
                show={this.show}
            />
        );
    }

    render() {
        const { show, props: { style } } = this;
        observePubSub(show);

        return (
            <Box
                pad={{ vertical: 'medium' }}
                className="show-edit-form"
                style={{ ...style, height: 'auto' }}
            >
                <NetworkActivityOverlay model={show} />
                {this.renderPage()}
                <Form tag="div" state={this.formState}>
                    <Row>
                        <Field name="title" xs={6} lg={3} validate={nonBlank} />

                        <Field name="sub_title" sm={6} lg={3} />

                        <Field name="description" sm={12} lg={6} />

                        <Field
                            name="venue_id" label="Venue"
                            type="select" collection={this.venues} validate={nonBlank}
                            sm={6} md={4} lg={3}
                        />

                        <Field
                            name="presenter_id" label="Presented By"
                            type="select" collection={this.presenters} sm={6} md={4} lg={3}
                        />

                        <Field type="number" name="price" validate={numberValue} sm={6} md={4} lg={3} />
                        <Field type="number" name="capacity" validate={numberValue} sm={6} md={4} lg={3} />
                        <Field
                            type="date" label="Visible After" name="visible_during.start"
                            validate={dateValue} sm={6} md={4} lg={3} />
                        <Field
                            type="date" label="Visible Until" name="visible_during.end"
                            validate={dateValue} sm={6} md={4} lg={3} />

                        <Field type="checkbox" name="can_purchase" sm={6} md={4} lg={3} />

                        <Field
                            name="external_url" sm={6} md={4} lg={3}
                            validate={validURL({ allowBlank: true })} />

                    </Row>
                    <Row>
                        <Asset model={show} name="image" sm={5} xs={12} />
                        <ShowTimes show={show} sm={7} xs={12}/>
                    </Row>
                </Form>
                <Footer
                    margin="small"
                    justify="end"
                    pad={{ horizontal: 'small', between: 'small' }}
                >
                    <Button
                        label="Edit Page" onClick={show.isNew ? null : this.editPage} accent
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
