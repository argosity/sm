/** @jsx Preact.h */
import Preact from 'preact';
import dateFormat from 'hippo/lib/date-format';
import Form from './purchase-form/form';
import TextField from './purchase-form/text-field';
import CardField from './purchase-form/card-field';
import './purchase-form/purchase-form-styles.scss';
import applyStyleRules from './apply-style-rules';
import Sale from './sale';
import TestEnvWarning from './purchase-form/test-env-warning';

function currency(s) {
    return parseFloat(s).toFixed(2);
}

function formattedOccurs(st) {
    return dateFormat(Date.parse(st.occurs_at), 'h:MMtt mmm dS yyyy');
}

export default class PurchaseForm extends Preact.Component {

    static boot(id, embed) {
        Preact.render(
            <PurchaseForm showId={id} embed={embed} />,
            embed.root,
        );
    }

    constructor(props) {
        super(props);
        this.embed = props.embed;
        this.sale = new Sale({
            host: this.props.embed.host,
            showId: this.props.showId,
            embedId: this.props.embed.id,
        });
        this.state = {
            qty: 1,
        };
    }

    componentWillMount() {
        this.sale.fetch((info) => {
            this.setState({ show: info.show });
            if (info.css_values) {
                applyStyleRules(this.embed.root, info.css_values);
            }
        });
    }

    onTimeChange = (ev) => {
        this.sale.showTime = this.state.show.times[ev.target.value];
        this.forceUpdate();
    }

    get availableTimes() {
        const { show, show: { times } } = this.sale;
        const now = Date.now();
        const future = [];
        for (let i = 0; i < times.length; i += 1) {
            const time = times[i];
            if (!time.price) {
                time.price = show.price;
            }
            if (Date.parse(time.occurs_at) > now) {
                future.push(time);
            }
        }
        return future;
    }

    renderTimes() {
        const times = this.availableTimes;

        if (1 === times.length) {
            return <h3>{formattedOccurs(times[0])}</h3>;
        }

        return (
            <div className="select-time">
                <select onChange={this.onTimeChange}>
                    {times.map((st, index) => (
                        <option key={st.identifier} value={index}>
                            ${currency(st.price)} — {formattedOccurs(st)}
                        </option>))}
                </select>
            </div>
        );
    }

    renderSaving() {
        if (!this.state.isSaving) { return null; }
        return (
            <div className="saving">
                <span className="message">
                    <span className="sm-embed-spinner"/> Submitting order…
                </span>
            </div>
        );
    }

    renderLoading() {
        return (
            <div className="loading">
                <span className="message">
                    <span className="sm-embed-spinner"/> Loading…
                </span>
            </div>
        );
    }

    onQtyChange = (ev) => {
        const qty = parseInt(ev.target.value.replace(/\D/, ''), 10);
        this.sale.qty = qty;
        this.setState({ qty, total: this.sale.total });
    }

    onCancel = () => {
        window.location.hash = '';
    }

    onFieldsReady = ({ tokenize }) => {
        this.setState({ isReady: true, tokenize });
    }

    get isSaving() {
        return this.state.isSaving;
    }

    onPurchase = () => {
        const { sale } = this;
        if (!sale.isValid) {
            sale.displayErrors = true;
            this.forceUpdate();
            return;
        }
        this.setState({ isSaving: true });
        this.state.tokenize().then(({ token, cardData }) => {
            sale.nonce = token;
            sale.cardData = cardData;
            sale.sync.save(() => {
                if (sale.order) {
                    this.embed.lastOrder = sale.order;
                    window.location.hash = `order/${sale.order.identifier}`;
                }
                this.setState({ isSaving: false });
            });
        }).catch(({ errors }) => {
            sale.errors = errors;
            this.setState({ isSaving: false });
        });
    }


    renderErrors() {
        if (!this.sale.errors) { return null; }
        return (
            <div className="errors">{this.sale.errorMessage}</div>
        );
    }

    get className() {
        const cn = ['show-purchase'];
        if (!this.state.isReady) { cn.push('is-pending'); }
        return cn.join(' ');
    }

    render() {
        const {
            state: { show }, sale, sale: {
                qty, total, vendor, authorization, isReady,
            },
        } = this;
        if (!isReady) { return this.renderLoading(); }

        return (
            <div className={this.className}>
                <div className="show-info">
                    {show.image && <img className="logo" src={`${show.assets_url}/${show.image.file_data.medium.id}`} />}
                    <div className="description">
                        <h1>{show.title}</h1>
                        <h3 className="sub-title">{show.sub_title}</h3>
                        <p className="description">{show.description}</p>
                    </div>
                </div>
                <div className="totals">
                    {this.renderTimes()}
                    <input
                        value={qty}
                        onChange={this.onQtyChange}
                        className="qty"
                        name="qty"
                        type="number"
                        min={1}
                    />
                    <div className="total">
                        <sub>$</sub> {total}
                    </div>
                </div>
                <Form
                    vendor={vendor}
                    authorization={authorization}
                    onError={this.onError}
                    onValidityChange={this.onValidityChange}
                    onCardTypeChange={this.onCardTypeChange}
                    onReady={this.onFieldsReady}
                    styles={{
                        base: {
                            color: '#3a3a3a',
                            'line-height': '40px',
                            'font-size': '16px',
                        },
                        focus: {
                            color: 'black',
                        },
                    }}
                >
                    {this.renderSaving()}
                    <TextField label="Name" name="name" type="text" sale={sale} />
                    <TextField label="Email" name="email" type="email" sale={sale} />
                    <TextField label="Phone" name="phone" type="tel" sale={sale} />
                    <CardField label="Zip Code" type="postalCode" sale={sale} />
                    <CardField
                        label="Card Number" type="cardNumber"
                        placeholder="•••• •••• •••• ••••"
                        sale={sale}
                    />
                    <CardField
                        label="Expiration" type="expirationDate" sale={sale}
                        placeholder="MM/YY"
                    />
                    <CardField label="Card CVV" type="cvv" sale={sale} />
                </Form>
                {this.renderErrors()}
                <TestEnvWarning vendor={vendor} />
                <div className="actions">
                    <button
                        disabled={this.isSaving}
                        class="btn btn-default btn-cancel"
                        onClick={this.onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        disabled={this.isSaving}
                        class="btn btn-primary btn-purchase"
                        onClick={this.onPurchase}
                    >
                        Purchase
                    </button>
                </div>
            </div>
        );
    }

}
