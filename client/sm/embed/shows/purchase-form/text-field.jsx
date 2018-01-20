/** @jsx Preact.h */
import Preact from 'preact';

export default class TextField extends Preact.Component {

    static contextTypes = {
        paymentFieldsApi: {},
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        this.fieldId = this.context.paymentFieldsApi.checkInField({
            onFocus: this.onFocus,
            onBlur: this.onBlur,
            type: this.props.type,
        });
    }

    onFocus = () => {
        this.setState({ focused: true, touched: true });
    }

    onBlur = () => {
        this.setState({ focused: false });
    }

    get className() {
        const { name } = this.props;
        const list = ['payment-field', 'text', name];
        if (this.isInvalid) {
            list.push('error');
        }
        if (this.state.focused) { list.push('focused'); }
        if (this.props.className) { list.push(this.props.className); }
        return list.join(' ');
    }

    get isInvalid() {
        const { focused, touched } = this.state;
        const { sale, name } = this.props;
        if (focused) {
            return false;
        }
        if (!sale.isInvalid(name) || !(touched || sale.displayErrors)) {
            return false;
        }
        return true;
    }

    onChange = (ev) => {
        this.props.sale[this.props.name] = ev.target.value;
    }

    render({ label, name, type }) {
        return (
            <label className={this.className}>
                <span className="top">
                    <span>{label}</span>
                    {this.isInvalid && <span className="error">Required</span>}
                </span>
                <input
                    name={name}
                    type={type}
                    onChange={this.onChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                />
            </label>
        );
    }

}
