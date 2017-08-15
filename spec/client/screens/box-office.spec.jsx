import { React, Snapshot, getScreenInstance } from 'hippo/testing/index';
import Gate from 'sm/screens/gate';

const screenInstance = getScreenInstance('gate');

describe('Screen Gate', () => {
    it('renders and matches snapshot', () => {
        const screen = shallow(<Gate screen={screenInstance} />);
        expect(screen).toHaveRendered('Gate');
        expect(Snapshot(<Gate screen={screenInstance} />)).toMatchSnapshot();
    });
});
