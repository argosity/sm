import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { action, observable, computed } from 'mobx';
import SwipeableViews from 'react-swipeable-views';
import createHistory from 'history/createHashHistory';
import ShowModel from '../../models/show';
import NoShowsFoundMessage from './none-found-message';
import Information from './information';
import Purchase from './purchase';
import Receipt from './receipt';
import Show from './show';
import StyledListing from './styled-listing';

//import './listing.scss';

const VIEWS = {
    info: Information,
    purchase: Purchase,
    receipt: Receipt,
};

const isShowIdentifier = (view, identifier) => identifier && view !== 'receipt';

@observer
export default class Listing extends React.Component {

    static propTypes = {
        shows: MobxPropTypes.observableArrayOf(
            PropTypes.instanceOf(ShowModel),
        ).isRequired,
    }
    @observable history;
    @observable displaying;
    @observable unlistenHistory;
    @observable identifier;
    @observable lastSale;

    componentWillMount() {
        this.history = createHistory();
        this.onViewChange(this.history.location);
        this.historyUnlisten = this.history.listen(this.onViewChange);
    }

    @action.bound onViewChange(location) {
        const [_, identifier, view] = location.pathname.split('/');
        this.identifier = identifier;
        if (isShowIdentifier(view, identifier)) {
            this.show = this.props.shows.find(s => s.identifier === identifier);
            if (this.show) {
                this.displaying = view;
            } else {
                ShowModel.fetchPublicShow(identifier).then((s) => {
                    this.show = s;
                    this.displaying = view; // FIXME show "not found"
                });
            }
        } else {
            this.displaying = view;
        }
    }

    componentWillUnmount() {
        this.unlistenHistory();
    }

    @computed get displayIndex() {
        return this.displaying ? 1 : 0;
    }

    @action.bound
    onDisplayInfo(show) {
        this.history.push(`/${show.identifier}/info`);
    }

    @action.bound
    onPurchase(show) {
        this.history.push(`/${show.identifier}/purchase`);
    }

    @action.bound
    onHideDisplay() {
        this.history.push('/');
    }

    @action.bound
    onPurchaseComplete(sale) {
        this.history.push(`/${sale.identifier}/receipt`);
        this.lastSale = sale;
    }

    renderInfoPanel() {
        const View = VIEWS[this.displaying];

        if (!View) { return null; }
        return (
            <View
                show={this.show}
                identifier={this.identifier}
                lastSale={this.lastSale}
                onPurchase={this.onPurchase}
                onPurchaseComplete={this.onPurchaseComplete}
                onCancel={this.onHideDisplay}
            />
        );
    }

    render() {
        const { shows } = this.props;

        return (
            <StyledListing>
                <SwipeableViews
                    disabled
                    className="view"
                    index={this.displayIndex}
                >
                    <div className="listing">
                        {map(shows, show => (
                            <Show
                                key={show.identifier}
                                show={show}
                                onPurchase={this.onPurchase}
                                displayShow={this.onDisplayInfo}
                            />
                        ))}
                        <NoShowsFoundMessage shows={shows} />
                    </div>
                    <div className="info">
                        {this.renderInfoPanel()}
                    </div>
                </SwipeableViews>
                <p className="credits">
                    listing generated by <a href="https://showmaker.com" target="_blank">ShowMaker.com</a>
                </p>
            </StyledListing>
        );
    }

}
