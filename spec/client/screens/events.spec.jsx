import { React, Snapshot, getScreenInstance } from 'lanes/testing/index';

import Events from 'sm/screens/events';

const screenInstance = getScreenInstance('events');

describe('Screen Events', () => {
    it('renders and matches snapshot', () => {
        const screen = mount(<Events screen={screenInstance} />);

        //        console.log(screen.debug())
        //        expect(screen).toHaveRendered('Screen');
        //        expect(Snapshot(<Events screen={screenInstance} />)).toMatchSnapshot();
    });
});
