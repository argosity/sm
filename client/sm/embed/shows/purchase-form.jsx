/** @jsx Preact.h */
import Preact from 'preact';
import dateFormat from 'hippo/lib/date-format';
import Form from './purchase-form/form';
import TextField from './purchase-form/text-field';
import CardField from './purchase-form/card-field';
import './purchase-form/purchase-form-styles.scss';
import applyStyleRules from './apply-style-rules';
import Sale from './sale';

function currency(s) {
    return parseFloat(s).toFixed(2);
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

    renderTimes() {
        const { show } = this.sale;

        if (1 === show.times.length) {
            return <h3>{show.times[0].formattedOccursAt}</h3>;
        }

        return (
            <div className="select-time">
                <select onChange={this.onTimeChange}>
                    {show.times.map((st, index) => (
                        <option key={st.identifier} value={index}>
                            ${currency(st.price)} — {dateFormat(Date.parse(st.occurs_at), 'h:MMtt mmm dS yyyy')}
                        </option>))}
                </select>
            </div>
        );
    }

    renderLoading() {
        return <h1 className="loading">Loading…</h1>;
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

    onPurchase = () => {
        const { sale } = this;
        if (!sale.isValid) {
            sale.displayErrors = true;
            this.forceUpdate();
            return;
        }
        this.state.tokenize().then(({ token, cardData }) => {
            sale.nonce = token;
            sale.cardData = cardData;
            sale.save(() => {
                if (sale.order) {
                    this.embed.lastOrder = sale.order;
                    window.location.hash = `order/${sale.order.identifier}`;
                }
                this.forceUpdate();
            });
        }).catch(({ errors }) => {
            sale.errors = errors;
            this.forceUpdate();
        });
    }


    renderErrors() {
        if (!this.sale.errors) { return null; }
        return (
            <div className="errors">
                {this.sale.errors.map(e => e.message).join('; ')}
            </div>
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
                <div className="actions">
                    <button class="btn btn-default btn-cancel" onClick={this.onCancel}>
                        Cancel
                    </button>
                    <button class="btn btn-primary btn-purchase" onClick={this.onPurchase}>
                        Purchase
                    </button>
                </div>
            </div>
        );
    }

}
