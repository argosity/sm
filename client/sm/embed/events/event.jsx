import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import Value from 'grommet/components/Value';

import Image from './image';
import EventModel from '../../models/embed/event';
import InfoButton from './info-button';
import PurchaseButton from './purchase-button';
import Presenter from './presenter';

@observer
export default class Event extends React.PureComponent {
    static propTypes = {
        event: PropTypes.instanceOf(EventModel).isRequired,
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

    renderPurchaseTime() {
        if (!this.props.event.commonTime) { return null; }
        return <span className="common-time">{this.props.event.commonTime}</span>;
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
                    <div className="title">
                        <Presenter presenter={event.presenter} />
                        <h2>{event.title}</h2>
                    </div>
                    <h3 className="sub-title">{event.sub_title}</h3>
                    <p className="description">{event.description}</p>
                    <div className="event-occurrences">
                        {this.renderPurchaseTime()}
                        <ul className="dates">
                            {event.occurrences.map(occ =>
                                <li key={occ.identifier} className="date">{occ.formattedOccursAt}</li>,
                            )}
                        </ul>
                    </div>
                </div>
                <div className="actions">
                    <InfoButton onClick={this.onInfo} event={event} />
                    <PurchaseButton onClick={this.onPurchase} event={event} />
                </div>
            </div>
        );
    }
}
