import { React, Snapshot, getScreenInstance } from 'hippo/testing';
import Presenters from 'sm/screens/presenters';

const screenInstance = getScreenInstance('events');

describe('Screen Presenters', () => {
    it('renders and matches snapshot', () => {
        expect(Snapshot(<Presenters screen={screenInstance} />)).toMatchSnapshot();
    });
});
