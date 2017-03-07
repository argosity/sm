import React from 'react';
import Events from 'sh/screens/events';
import { Snapshot, getScreenInstance } from 'lanes/testing/screens';

const screenInstance = getScreenInstance('events');

describe('Screen Events', () => {
    it('renders and matches snapshot', () => {
        const screen = mount(<Events screen={screenInstance} />);
        console.log(screen.debug())
//        expect(screen).toHaveRendered('Screen');
//        expect(Snapshot(<Events screen={screenInstance} />)).toMatchSnapshot();
    });
});
