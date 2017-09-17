import { React, Snapshot, getScreenInstance } from 'hippo/testing/index';
import Messages from 'sm/screens/messages';

const screenInstance = getScreenInstance('messages');

describe('Screen Messages', () => {
    it('renders and matches snapshot', () => {
        const screen = mount(<Messages screen={screenInstance} />);
        expect(screen).toHaveRendered('FormWrapper');
    });
});
