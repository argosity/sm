/** @jsx Preact.h */
import Preact from 'preact';
import Vendors from 'payment-fields/dist/vendors';
import MockApi from './mock-api';

export default class PaymentFields extends Preact.Component {

    static childContextTypes = {
        paymentFieldsApi: {},
    }

    constructor(props) {
        super(props);
        const Api = Vendors[props.vendor] || MockApi;
        this.api = new Api(props);
    }

    componentDidMount() {
        this.api.setAuthorization(this.props.authorization);
    }

    componentWillUnmount() {
        this.api.teardown();
    }

    componentWillReceiveProps(nextProps) {
        this.api.setAuthorization(nextProps.authorization);
    }

    tokenize(options) {
        return this.api.tokenize(options);
    }

    getChildContext() {
        return { paymentFieldsApi: this.api };
    }

    render() {
        return (
            <div className="payment-fields-wrapper">
                {this.props.children}
            </div>
        );
    }

}
