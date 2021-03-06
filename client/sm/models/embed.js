import { extend } from 'lodash';
import { readonly } from 'core-decorators';
import { computed } from 'mobx';
import Page from 'hippo/models/page';
import {
    BaseModel, identifiedBy, identifier, field, belongsTo,
} from './base';
import defaultCSSValues from './embed_css_defaults';

@identifiedBy('sm/embed')
export default class Embed extends Page.hasPageMixin(BaseModel) {

    @identifier id;

    @field identifier;

    @field name;

    @field({ type: 'object' }) css_values = {};

    @belongsTo({ model: Page, inverseOf: 'owner' }) page;

    @computed get html() {
        const url = `${window.location.protocol}//${window.location.host}`;
        return `<div id="showmaker-shows-listing"></div>\n<script async src="${url}/assets/embedded-shows.js" data-render-to="#showmaker-shows-listing" data-embed-id="${this.identifier}"></script>`;
    }

    @readonly static css_value_labels = {
        'default-btn-color':          'text color for standard buttons',
        'default-btn-bg-color':       'background color for standard buttons',
        'default-btn-bg-color-hover': 'hover color for standard buttons',
        'primary-btn-color':          'text color for primary buttons',
        'primary-btn-bg-color':       'background color for primary buttons',
        'primary-btn-bg-color-hover': 'hover color for primary buttons',
        'input-border-color':         'color for border of inputs',
        'input-text-color':           'color for text in input fields',
        'input-focused-color':        'color for text in input when focused',
        'input-error-color':          'color for inputs that have errors',
        'error-background-color':     'background color for errors',
        'error-color':                'text color for errors',
    }

    get_css_value(key) {
        return this.css_values[key] || defaultCSSValues[key];
    }

    set_css_value(key, value) {
        this.css_values = extend({}, this.css_values, { [`${key}`]: value });
    }

}
