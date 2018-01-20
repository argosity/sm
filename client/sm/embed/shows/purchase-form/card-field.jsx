/** @jsx Preact.h */
import Preact from 'preact';

export default class CardField extends Preact.Component {

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
            onValidityChange: this.onValidChange,
            placeholder: this.props.placeholder || '',
            type: this.props.type,
        });
    }

    onValidChange = (ev) => {
        this.setState({ isValid: ev.isValid });
    }

    onFocus = () => {
        this.setState({ focused: true });
    }

    onBlur = (ev) => {
        this.setState({ isValid: ev.isValid, focused: false, displayErrors: true });
    }

    get isInvalid() {
        const { sale } = this.props;
        const { displayErrors, focused, isValid } = this.state;
        return (!focused && (displayErrors || sale.displayErrors) && !isValid);
    }

    get className() {
        const list = ['payment-field', 'card', this.props.type];
        if (this.state.focused) { list.push('focused'); }
        if (this.isInvalid) { list.push('error'); }
        if (this.props.className) { list.push(this.props.className); }
        return list.join(' ');
    }

    render({ label }) {
        return (
            <div className={this.className}>
                <span className="top">
                    <span>{label}</span>
                    {this.isInvalid && <span className="error">Invalid</span>}
                </span>
                <div id={this.fieldId} className="card-field"/>
            </div>
        );
    }

}
