import React from 'react'; // eslint-disable-line no-unused-vars
import chronokinesis from 'chronokinesis';
import moment from 'moment-timezone';
import ShowModel from 'sm/models/show';

import Listing from 'sm/embed/shows/listing';
import { observable } from 'mobx';
import DATA from './data.json';


describe('Embedded Shows Listing', () => {
    let shows;
    let listing;

    beforeEach(() => {
        chronokinesis.travel(new Date('2017-05-01T21:00:00.000Z'));
        moment.tz.setDefault('America/Los_Angeles');
        shows = observable.array(DATA.map(ev => new ShowModel(ev)));
        listing = mount(<Listing shows={shows} />);
        // grommit layer needs container
        document.body.appendChild(document.createElement('div'));
    });
    afterEach(() => {
        chronokinesis.reset();
    });

    it('renders shows and matches snapshot', () => {
        DATA.forEach(ev =>
            expect(listing).toHaveRendered(`[data-show-identifier="${ev.identifier}"]`));
    });

    it('displays info for shows that have a page', () => {
        expect(listing).toHaveRendered('[data-show-identifier="cwMx65DgEAfG"] InfoButton Button');
        expect(listing).not.toHaveRendered('[data-show-identifier="sehR4uN224XV"] InfoButton Button');
    });

    it('displays purchase for shows that are purchasable', () => {
        expect(listing).toHaveRendered('[data-show-identifier="cwMx65DgEAfG"] PurchaseButton Button');
        expect(listing).not.toHaveRendered('[data-show-identifier="sehR4uN224XV"] PurchaseButton Button');
    });

    it('can display info', () => {
        expect(listing).not.toHaveRendered('Information');
        listing.find('[data-show-identifier="cwMx65DgEAfG"] InfoButton Button').simulate('click');
        expect(listing).toHaveRendered('Information');
    });
});
