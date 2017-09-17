import { React, getScreenInstance } from 'hippo/testing/index'; // eslint-disable-line
import Messages from 'sm/screens/messages';

const screenInstance = getScreenInstance('messages');

describe('Screen Messages', () => {
    it('renders and matches snapshot', () => {
        const screen = mount(<Messages screen={screenInstance} />);
        expect(screen).toHaveRendered('FormWrapper');
    });
});
