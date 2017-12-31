import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { computed, action, observable } from 'mobx';
import Heading   from 'grommet/components/Heading';
import Button    from 'grommet/components/Button';
import Sale from '../../models/sale';
import SaleForm from '../../components/sale/form';
import ShowModel from '../../models/show';
import Image from './image';

@observer
export default class Purchase extends React.Component {

    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onPurchaseComplete: PropTypes.func.isRequired,
        show: PropTypes.instanceOf(ShowModel).isRequired,
    }

    @observable isTokenizing = false;
    @observable _sale;

    @computed get sale() {
        if (!this.props.show) { return null; }
        if (!this._sale) { this._sale = new Sale({ show: this.props.show }); }
        return this._sale;
    }

    @action.bound
    onComplete() {
        this.props.onPurchaseComplete(this.sale);
    }

    @action.bound
    setFormRef(form) { this.form = form; }

    renderCantPurchase() {
        return (
            <div className="show-purchase">
                <h2>Unable to purchase {this.props.show.title}</h2>
                <p>Sorry, but it is no longer listed for sale</p>
                <Button label="Back to listing" onClick={this.props.onCancel} primary />
            </div>
        );
    }

    render() {
        const { sale, props: { show, onCancel } } = this;
        if (!show || !sale) { return null; }

        if (!show.onlinePurchasableTimes.length) { return this.renderCantPurchase(); }

        return (
            <div className="show-purchase">
                <div className="top-info">
                    <Image image={show.image} size="thumbnail" />
                    <div className="description">
                        <Heading>{show.title}</Heading>
                        <h3 className="sub-title">{show.sub_title}</h3>
                        <p className="description">{show.description}</p>
                    </div>
                </div>
                <SaleForm
                    online
                    sale={sale}
                    onComplete={this.onComplete}
                    ref={this.setFormRef}

                    controls={
                        <Button label="Cancel" onClick={onCancel} accent />
                    }
                >
                </SaleForm>
            </div>
        );
    }

}
