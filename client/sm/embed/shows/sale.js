import xhr from 'hippo/lib/xhr';

export default class Sale {

    constructor({ embedId, showId, host }) {
        this.qty = 1;
        this.embedId = embedId;
        this.showId = showId;
        this.host = host;
    }

    get isValid() {
        return Boolean(
            this.qty && this.showTime && this.name && this.email,
        );
    }

    isInvalid(field) {
        if (-1 !== ['qty', 'name', 'email'].indexOf(field)) {
            return !this[field];
        }
        return false;
    }

    get total() {
        if (!this.qty || !this.showTime) { return ''; }
        const t = Math.round(
            this.showTime.price * this.qty,
        );
        return `${t.toFixed(2)}`;
    }

    get isReady() {
        return Boolean(this.vendor);
    }

    fetch(cb) {
        xhr({ url: `${this.host}/api/sm/embed/shows/${this.embedId}/purchase/${this.showId}` }, {
            success: ({ response }) => {
                const reply = JSON.parse(response);
                this.vendor = reply.vendor;
                this.authorization = reply.authorization;
                this.show = reply.show;
                this.showTime = reply.show.times.length ? reply.show.times[0] : null;
                cb(reply);
            },
        });
    }

    get data() {
        return {
            name: this.name,
            phone: this.phone,
            email: this.email,
            qty: this.qty,
            time_identifier: this.showTime.identifier,
            payments: [{
                nonce: this.nonce,
                card_type: this.cardData.card_brand,
                digits: this.cardData.last_4,
            }],
        };
    }

    recordSaveFailure(done, err) {
        this.order = null;
        this.errors = err.errors;
        done(this);
    }

    get errorMessage() {
        if (!this.errors) { return ''; }
        const keys = Object.keys(this.errors);
        const msgs = [];
        for (let i = 0; i < keys.length; i += 1) {
            const err = this.errors[keys[i]];
            msgs.push('base' === keys[i] ? err : `${keys[i]}: ${err}`);
        }
        return msgs.join('; ');
    }

    save(done) {
        xhr({
            method: 'POST',
            data: this.data,
            url: `${this.host}/api/sm/sale/submit.json`,
        }, {
            success: ({ response }) => {
                this.order = JSON.parse(response).data;
                this.error = null;
                done(this);
            },
            failure: ({ response }) => {
                try {
                    this.recordSaveFailure(done, JSON.parse(response));
                } catch (err) {
                    this.recordSaveFailure(done, {
                        success: false, errors: { base: String(err) },
                    });
                }
            },
        });
    }

}
