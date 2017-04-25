import { action, observable, computed, autorun } from 'mobx';
import { addFormFieldValidations, nonBlank, stringValue, numberValue, dateValue, anyValue } from 'lanes/lib/forms';

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { pick, mapValues, keys } from 'lodash';
import { observer }   from 'mobx-react';
import Box from 'grommet/components/Box';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import DocumentTextIcon from 'grommet/components/icons/base/DocumentText';
import SaveIcon from 'grommet/components/icons/base/Save';

import Field from 'lanes/components/form-field';
import Asset from 'lanes/components/asset';
import Query from 'lanes/models/query';

import PageEditor from './page-editor';
import Venue from '../../models/venue';
import Event from '../../models/event';
import Presenter from '../../models/presenter';
import NetworkActivityOverlay from 'lanes/components/network-activity-overlay';

@observer
class EditForm extends React.PureComponent {

    static propTypes = {
        query:      PropTypes.instanceOf(Query).isRequired,
        event:      PropTypes.instanceOf(Event).isRequired,
        index:      PropTypes.number.isRequired,
        onComplete: PropTypes.func.isRequired,
        formState:  PropTypes.shape({
            touchd: PropTypes.bool,
            valid:  PropTypes.bool,
        }).isRequired,

        fields: PropTypes.object.isRequired,
        setDefaultValues: PropTypes.func.isRequired,
    }

    static desiredHeight = 300

    static formFields = {
        title:         nonBlank,
        sub_title:     stringValue,
        description:   stringValue,
        price:         numberValue,
        venue_id:      nonBlank,
        presenter_id:  anyValue,
        occurs_at:     dateValue,
        onsale_after:  nonBlank,
        visible_until: nonBlank,
        visible_after: nonBlank,
        onsale_until:  nonBlank,
        capacity:      numberValue,
    }

    componentWillMount() {
        this.props.setDefaultValues(this.event);
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
        this.event.set(
            pick(mapValues(this.props.fields, 'value'), keys(this.constructor.formFields)),
        );
        this.event.save().then(this.onSaved);
    }

    @action.bound
    onSaved() {
        if (!this.event.errors) {
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
        return this.props.formState.valid && !this.event.syncInProgress;
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
        const { event, props: { fields, style } } = this;

        return (
            <Box
                separator='horizontal'
                pad={{ vertical: 'medium' }}
                className="event-edit-form"
                style={{ ...style, height: 'auto' }}
            >
                <NetworkActivityOverlay model={event} />
                {this.renderPage()}
                <Row>
                    <Field fields={fields} name="title" xs={6} lg={3} />
                    <Field fields={fields} name="sub_title" xs={6} lg={3} />

                    <Field fields={fields} name="description" xs={12} lg={6} />

                    <Field type="number" fields={fields} name="price" xs={6} lg={3} />
                    <Field type="number" fields={fields} name="capacity" xs={6} lg={3} />



                    <Field type="date" fields={fields} name="visible_after" lg={3} xs={6} />
                    <Field type="date" fields={fields} name="visible_until" lg={3} xs={6} />

                    <Field type="date" fields={fields} name="onsale_after" lg={3} xs={6} />
                    <Field type="date" fields={fields} name="onsale_until" lg={3} xs={6} />

                </Row>
                <Row>
                    <Asset model={event} name="image" lg={3} xs={6} />
                    <Col lg={9} xs={6}>
                        <Row>
                            <Field type="date" fields={fields} name="occurs_at" md={3} xs={12} />

                            <Field
                                fields={fields} name="venue_id" label="Venue" md={3} xs={12}
                                type="select" collection={this.venues}
                            />
                            <Field
                                fields={fields} name="presenter_id" label="Presented By" md={3} xs={12}
                                type="select" collection={this.presenters}
                            />
                        </Row>
                    </Col>
                </Row>

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

export default addFormFieldValidations(EditForm, 'desiredHeight');
