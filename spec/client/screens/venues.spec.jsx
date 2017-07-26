import React from 'react';
import Venues from 'sm/screens/venues';
import { Snapshot, getScreenInstance } from 'hippo/testing/screens';

const screenInstance = getScreenInstance('events');

describe('Screen Venues', () => {
    it('renders', () => {
        const venues = mount(<Venues screen={screenInstance} />);
        expect(venues.exists()).toBe(true);
    });
});
