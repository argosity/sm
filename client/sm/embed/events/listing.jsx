import React from 'react';
import PropTypes from 'prop-types';

import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { action, observable, computed } from 'mobx';

import EventModel from '../../models/embed/event';
import PurchaseModel from '../../models/embed/purchase';
import Information from './information';
import Purchase from './purchase';
import Receipt from './purchase-receipt';
import Event from './event';

import './listing.scss';

@observer
export default class Listing extends React.PureComponent {
    static propTypes = {
        events: MobxPropTypes.observableArrayOf(
            PropTypes.instanceOf(EventModel),
        ).isRequired,
    }

    @observable displaying = {}
    @observable purchase = new PurchaseModel();

    @action.bound
    onDisplayInfo(event) {
        this.displaying = { event, view: 'info' };
    }

    @action.bound
    onPurchase(event) {
        this.displaying = { event, view: 'purchase', purchase: this.purchase };
    }

    @action.bound
    onHideDisplay() {
        this.displaying = {};
    }

    @action.bound
    onPurchaseComplete() {
        this.displaying = { view: 'receipt', purchase: this.purchase };
        this.purchase = new PurchaseModel();
    }

    @computed get Layer() {
        const { view } = this.displaying;
        if ('info' === view) {
            return Information;
        } else if ('purchase' === view) {
            return Purchase;
        } else if ('receipt' === view) {
            return Receipt;
        }
        return null;
    }

    @computed get actionsLayer() {
        const { Layer } = this;
        if (!Layer) { return null; }

        return (
            <Layer
                {...this.displaying}
                onPurchase={this.onPurchase}
                onPurchaseComplete={this.onPurchaseComplete}
                onCancel={this.onHideDisplay}
            />
        );
    }

    render() {
        return (
            <div className="hippo events-listing">
                {this.actionsLayer}
                <h1>{this.props.events.length} events</h1>
                {this.props.events.map(event => (
                    <Event
                        key={event.identifier}
                        event={event}
                        onPurchase={this.onPurchase}
                        displayEvent={this.onDisplayInfo}
                    />
                 ))}
            </div>
        );
    }
}
