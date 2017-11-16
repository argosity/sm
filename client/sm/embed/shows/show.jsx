import React        from 'react';
import PropTypes    from 'prop-types';
import { observer } from 'mobx-react';
import { action }   from 'mobx';

import Image          from './image';
import ShowModel      from '../../models/show';
import InfoButton     from './info-button';
import PurchaseButton from './purchase-button';
import Presenter      from './presenter';
import Venue          from './venue';

@observer
export default class Show extends React.Component {

    static propTypes = {
        show: PropTypes.instanceOf(ShowModel).isRequired,
        displayShow:  PropTypes.func.isRequired,
        onPurchase: PropTypes.func.isRequired,
    }

    @action.bound
    onInfo() {
        this.props.displayShow(this.props.show);
    }

    @action.bound
    onPurchase() {
        this.props.onPurchase(this.props.show);
    }

    renderPurchaseTime() {
        if (!this.props.show.commonTime) { return null; }
        return <span className="common-time">{this.props.show.commonTime}</span>;
    }

    render() {
        const { show } = this.props;
        return (
            <div
                className="show"
                data-show-identifier={show.identifier}
            >
                <Image image={show.image} className="logo"/>
                <div className="content">
                    <div className="main">
                        <div className="info">
                            <div className="title">
                                <Presenter presenter={show.presenter} />
                                <h2>{show.title}</h2>
                            </div>
                            <h3 className="sub-title">{show.sub_title}</h3>
                            <p className="description">{show.description}</p>
                            <div className="show-times">
                                {this.renderPurchaseTime()}
                                <ul className="dates">
                                    {show.times.map(t =>
                                        <li key={t.identifier} className="date">{t.formattedOccursAt}</li>)}
                                </ul>
                            </div>
                        </div>
                        <div className="actions">
                            <InfoButton onClick={this.onInfo} show={show} />
                            <PurchaseButton onClick={this.onPurchase} show={show} />
                        </div>
                    </div>
                    <Venue venue={show.venue} />
                </div>
            </div>
        );
    }

}
