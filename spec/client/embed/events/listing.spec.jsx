import { React, Snapshot, getScreenInstance } from 'hippo/testing/index';
import { delay } from 'lodash';
import MockDate from 'mockdate';

import EventModel from 'sm/models/embed/event';

import Listing from 'sm/embed/events/listing';
import { observable } from 'mobx';
import DATA from './data.json';


describe('Embedded Events Listing', () => {
    let events;
    let listing;
    beforeEach(() => {
        events = observable.array(DATA.map(ev => new EventModel(ev)));
        MockDate.set('2017-05-01');
        listing = mount(<Listing events={events} />);
        // grommit layer needs container
        document.body.appendChild(document.createElement('div'));
    });
    afterEach(() => {
        MockDate.reset();
    });

    it('renders events and matches snapshot', () => {
        DATA.forEach(ev =>
            expect(listing).toHaveRendered(`[data-event-identifier="${ev.identifier}"]`),
        );
        expect(Snapshot(<Listing events={events} />)).toMatchSnapshot();
    });

    it('displays info for events that have a page', () => {
        expect(listing).toHaveRendered('[data-event-identifier="cwMx65DgEAfG"] InfoButton Button');
        expect(listing).not.toHaveRendered('[data-event-identifier="sehR4uN224XV"] InfoButton Button');
    });

    it('displays purchase for events that are purchasable', () => {
        expect(listing).toHaveRendered('[data-event-identifier="cwMx65DgEAfG"] PurchaseButton Button');
        expect(listing).not.toHaveRendered('[data-event-identifier="sehR4uN224XV"] PurchaseButton Button');
    });

    it('can display info', () => {
        expect(listing).not.toHaveRendered('Information');
        listing.find('[data-event-identifier="cwMx65DgEAfG"] InfoButton Button').simulate('click');
        expect(listing).toHaveRendered('Information');
        const layer = document.querySelector('.grommetux-layer__container');
        expect(layer.textContent).toContain('test of stuff');
        layer.querySelector('.grommetux-layer__closer button').click();
        expect(document.querySelector('.grommetux-layer__container')).toBeNull();
    });

    it('can display purchase from info', () => {
        listing.find('[data-event-identifier="cwMx65DgEAfG"] InfoButton Button').simulate('click');
        document.querySelector('.grommetux-layer__container footer button').click();
    });

});
