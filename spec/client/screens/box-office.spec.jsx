import React from 'react'; // eslint-disable-line no-unused-vars
import { Snapshot, getScreenInstance } from 'hippo/testing/index';
import BoxOffice from 'sm/screens/box-office';

const screenInstance = getScreenInstance('box-office');

describe('Screen Gate', () => {
    it('renders and matches snapshot', () => {
        expect(Snapshot(<BoxOffice screen={screenInstance} />)).toMatchSnapshot();
    });
});
