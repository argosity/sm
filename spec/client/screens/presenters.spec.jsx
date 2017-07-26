import { React, Snapshot, getScreenInstance } from 'hippo/testing';
import Presenters from 'sm/screens/presenters';

const screenInstance = getScreenInstance('events');

describe('Screen Presenters', () => {
    it('renders', () => {
        const presenters = mount(<Presenters screen={screenInstance} />);
        expect(presenters.exists()).toBe(true);
    });
});
