import { uniqueId } from 'lodash';

class Field {

    constructor(options) {
        this.options = options;
        this.id = uniqueId('fld');
    }

    onBlur = (ev) => {
        this.options.onBlur({ isValid: !!ev.target.value });
    }

    attach() {
        const wrapper = document.querySelector(`.card-field#${this.id}`);
        if (wrapper) {
            const input = document.createElement('input');
            input.addEventListener('focus', this.options.onFocus);
            input.addEventListener('blur', this.onBlur);
            wrapper.appendChild(input);
        }
    }

}

export default class MockApi {

    fields = [];

    constructor(options) {
        this.options = options;
    }

    checkInField(options) {
        const field = new Field(options);
        this.fields.push(field);
        return field.id;
    }

    teardown() {
        this.fields = [];
    }

    tokenize() {
        return Promise.resolve({
            token: 'test-mock-token',
            cardData: {
                card_brand: 'test',
                last_4: 'test',
            },
        });
    }

    setAuthorization(auth) {
        if (this.authorization && this.fields.length) {
            return;
        }

        this.authorization = auth;
        this.fields.forEach(f => f.attach());
        this.options.onReady({ tokenize: args => this.tokenize(args) });
    }

}
