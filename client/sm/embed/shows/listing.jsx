import React from 'react';
import PropTypes from 'prop-types';

import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { action, observable, computed } from 'mobx';
import ShowModel from '../../models/show';
import Sale from '../../models/sale';
import NoShowsFoundMessage from './none-found-message';
import Information from './information';
import Purchase from './purchase';
import Receipt from './receipt';
import Show from './show';

import './listing.scss';

@observer
export default class Listing extends React.PureComponent {

    static propTypes = {
        shows: MobxPropTypes.observableArrayOf(
            PropTypes.instanceOf(ShowModel),
        ).isRequired,
    }

    @observable displaying = {}

    @action.bound
    onDisplayInfo(show) {
        this.displaying = { show, view: 'info' };
    }

    @action.bound
    onPurchase(show) {
        this.displaying = { show, view: 'purchase', sale: new Sale({ show }) };
    }

    @action.bound
    onHideDisplay() {
        this.displaying = {};
    }

    @action.bound
    onPurchaseComplete(sale) {
        this.displaying = { view: 'receipt', sale };
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
        const { shows } = this.props;
        return (
            <div className="hippo shows-listing">
                {this.actionsLayer}
                {shows.map(show => (
                    <Show
                        key={show.identifier}
                        show={show}
                        onPurchase={this.onPurchase}
                        displayShow={this.onDisplayInfo}
                    />
                ))}
                <NoShowsFoundMessage shows={shows} />
            </div>
        );
    }

}
