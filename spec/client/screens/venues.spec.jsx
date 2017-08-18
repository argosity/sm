import React from 'react'; // eslint-disable-line no-unused-vars
import Venues from 'sm/screens/venues';
import { Snapshot, getScreenInstance } from 'hippo/testing/screens';

const screenInstance = getScreenInstance('events');

describe('Screen Venues', () => {
    it('renders', () => {
        const venues = mount(<Venues screen={screenInstance} />);
        expect(venues.exists()).toBe(true);
        expect(Snapshot(<Venues screen={screenInstance} />)).toMatchSnapshot();
    });
});
