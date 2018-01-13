/** @jsx h */
import { h, Component } from 'preact';
import PaymentFields from 'payment-fields';
import xhr from 'hippo/lib/xhr';

//import React from 'react';
//import PropTypes from 'prop-types';
// import { observer } from 'mobx-react';
// import { computed, action, observable } from 'mobx';
// import Heading   from 'grommet/components/Heading';
// import Button    from 'grommet/components/Button';
// import Sale from '../../models/sale';
// import SaleForm from '../../components/sale/form';
// import ShowModel from '../../models/show';
// import Image from './image';

//@observer
export default class PurchaseForm extends Component {

    componentWillMount() {
        xhr({ url: this.props.url + '/purchase' }, {
            success: (resp) => {
                debugger
            },
        })
    }

    // constructor() {
    //     super()
    // }

    // static propTypes = {
    //     onCancel: PropTypes.func.isRequired,
    //     onPurchaseComplete: PropTypes.func.isRequired,
    //     show: PropTypes.instanceOf(ShowModel).isRequired,
    // }
    //
    //     @observable isTokenizing = false;
    //     @observable _sale;
    //
    //     @computed get sale() {
    //         if (!this.props.show) { return null; }
    //         if (!this._sale) { this._sale = new Sale({ show: this.props.show }); }
    //         return this._sale;
    //     }
    //
    //     @action.bound
    //     onComplete() {
    //         this.props.onPurchaseComplete(this.sale);
    //     }
    //
    //     @action.bound
    //     setFormRef(form) { this.form = form; }
    //
    //     renderCantPurchase() {
    //         return (
    //             <div className="show-purchase">
    //                 <h2>Unable to purchase {this.props.show.title}</h2>
    //                 <p>Sorry, but it is no longer listed for sale</p>
    //                 <Button label="Back to listing" onClick={this.props.onCancel} primary />
    //             </div>
    //         );
    //     }

    render() {
        // const { sale, props: { show, onCancel } } = this;
        // if (!show || !sale) { return null; }
        // if (!show.onlinePurchasableTimes.length) { return this.renderCantPurchase(); }
        return <h1>Purchase</h1>;
        // return (
        //     <div className="show-purchase">
        //         <PaymentFields
        //             vendor={'Square'}
        //             authorization={this.state.authorization}
        //             onError={this.onError}
        //             onValidityChange={this.onValidityChange}
        //             onCardTypeChange={this.onCardTypeChange}
        //             onReady={this.onFieldsReady}
        //             styles={{
        //                 base: {
        //                     'font-size': '24px',
        //                     'font-family': 'helvetica, tahoma, calibri, sans-serif',
        //                     padding: '6px',
        //                     color: '#7d6b6b',
        //                 },
        //                 focus: { color: '#000000' },
        //                 valid: { color: '#00bf00' },
        //                 invalid: { color: '#a00000' },
        //             }}
        //         >
        //             <PaymentFields.Field
        //                 type="cardNumber"
        //                 placeholder="•••• •••• •••• ••••"
        //                 onBlur={this.logEvent}
        //                 onFocus={this.logEvent}
        //                 onValidityChange={this.onNumberValid}
        //                 onChange={this.logEvent}
        //             />
        //         </PaymentFields>
        //     </div>
        // );
    }

}
