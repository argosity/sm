import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { action, observable, computed } from 'mobx';
import EventModel from 'sm/models/event';
import Button from 'grommet/components/Button';
import CircleInformationIcon from 'grommet/components/icons/base/CircleInformation';
import Information from './information';
import Purchase from './purchase';
import PurchaseModel from '../../models/purchase';
import PurchaseButton from './purchase-button';

import './listing.scss';

import Image from './image';


@observer
class Event extends React.PureComponent {
    static propTypes = {
        event: PropTypes.instanceOf(EventModel),
        displayEvent:  PropTypes.func.isRequired,
        onPurchase: PropTypes.func.isRequired,
    }

    // @action.bound
    onInfo() {
        this.props.displayEvent(this.props.event);
    }

    // @action.bound
    // onPurchase(event) {
    //     this.props.displayEvent(this.props.event);
    // }

    render() {
        const { event } = this.props;

        return (
            <div className="event">
                <Image image={event.image} />
                <div className="info">
                    <h2 className="title">{event.title}</h2>
                    <h3 className="sub-title">{event.sub_title}</h3>
                    <p className="description">{event.description}</p>
                </div>
                <div className="actions">
                    <Button
                        icon={<CircleInformationIcon />}
                        label='Information'
                        onClick={this.onInfo}
                        href='#'
                    />
                    <PurchaseButton onClick={this.props.onPurchase} event={event} />
                </div>
            </div>
        );
    }
}

@observer
export default class Listing extends React.PureComponent {
    static propTypes = {
        events: MobxPropTypes.observableArrayOf(
            PropTypes.instanceOf(EventModel),
        ).isRequired,
    }

    @observable purchasingEvent;
    @observable displayingEvent;

    @observable purchase = new PurchaseModel();

    componentWillMount() {
        this.purchase.fetch({ query: 'token' });
    }

    @action.bound
    onDisplayEvent(event) {
        this.displayingEvent = event;
    }

    @action.bound
    onPurchaseEvent(event) {
        this.displayingEvent = null;
        this.purchasingEvent = event;
    }

    @action.bound
    onDisplayEventHide() {
        this.displayingEvent = null;
    }

    @action.bound
    onPurchaseHide() {
        this.purchasingEvent = null;
    }

    @computed get purchaseLayer() {
        if (!this.purchasingEvent) { return null; }
        return (
            <Purchase
                purchase={this.purchase}
                event={this.purchasingEvent}
                onCancel={this.onPurchaseHide}
            />
        );
    }

    render() {
        return (
            <div className="events-listing">
                <Information
                    event={this.displayingEvent}
                    onPurchase={this.onPurchaseEvent}
                    onComplete={this.onDisplayEventHide}
                />
                {this.purchaseLayer}
                <h1>{this.props.events.length} events</h1>
                {this.props.events.map(event => (
                     <Event
                         key={event.id}
                         event={event}
                         onPurchase={this.onPurchaseEvent}
                         displayEvent={this.onDisplayEvent}
                     />
                 ))}
            </div>
        );
    }
}
