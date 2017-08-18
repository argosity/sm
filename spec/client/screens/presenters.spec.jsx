import React from 'react'; // eslint-disable-line no-unused-vars
import { Snapshot, getScreenInstance } from 'hippo/testing';
import Presenters from 'sm/screens/presenters';

const screenInstance = getScreenInstance('events');

describe('Screen Presenters', () => {
    it('renders', () => {
        const presenters = mount(<Presenters screen={screenInstance} />);
        expect(presenters.exists()).toBe(true);
        expect(Snapshot(<Presenters screen={screenInstance} />)).toMatchSnapshot();
    });
});
