import React from 'react';
import PropTypes from 'prop-types';
import Image from './image';
import { observer } from 'mobx-react';
import { action, observable, computed } from 'mobx';
import EventModel from '../../models/embed/event';

import InfoButton from './info-button';
import PurchaseButton from './purchase-button';

@observer
export default class Event extends React.PureComponent {
    static propTypes = {
        event: PropTypes.instanceOf(EventModel),
        displayEvent:  PropTypes.func.isRequired,
        onPurchase: PropTypes.func.isRequired,
    }

    @action.bound
    onInfo() {
        this.props.displayEvent(this.props.event);
    }

    @action.bound
    onPurchase() {
        this.props.onPurchase(this.props.event);
    }

    render() {
        const { event } = this.props;
        return (
            <div
                className="event"
                data-event-identifier={event.identifier}
            >
                <Image image={event.image} />
                <div className="info">
                    <h2 className="title">{event.title}</h2>
                    <h3 className="sub-title">{event.sub_title}</h3>
                    <p className="description">{event.description}</p>
                </div>
                <div className="actions">
                    <InfoButton onClick={this.onInfo} event={event} />
                    <PurchaseButton onClick={this.onPurchase} event={event} />
                </div>
            </div>
        );
    }
}
