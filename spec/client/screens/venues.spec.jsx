import React from 'react';
import Venues from 'sm/screens/venues';
import { Snapshot, getScreenInstance } from 'hippo/testing/screens';

const screenInstance = getScreenInstance('events');

describe('Screen Venues', () => {
    it('renders and matches snapshot', () => {
        expect(Snapshot(<Venues screen={screenInstance} />)).toMatchSnapshot();
    });
});
