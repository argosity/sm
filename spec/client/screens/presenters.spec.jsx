import { React, Snapshot, getScreenInstance } from 'lanes/testing';
import Presenters from 'sm/screens/presenters';

const screenInstance = getScreenInstance('events');

describe('Screen Presenters', () => {
    it('renders and matches snapshot', () => {
        expect(Snapshot(<Presenters screen={screenInstance} />)).toMatchSnapshot();
    });
});
