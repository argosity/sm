import React from 'react'; // eslint-disable-line no-unused-vars
import { Snapshot, getScreenInstance } from 'hippo/testing/index';
import BoxOffice from 'sm/screens/box-office';
import chronokinesis from 'chronokinesis';
import moment from 'moment-timezone';

const screenInstance = getScreenInstance('box-office');

describe('Screen Gate', () => {
    beforeEach(() => {
        chronokinesis.travel(new Date('2017-05-01T21:00:00.000Z'));
        moment.tz.setDefault('America/Los_Angeles');
    });

    it('renders and matches snapshot', () => {
        screenInstance.id = 'BOXOFFICE';
        expect(Snapshot(<BoxOffice screen={screenInstance} />)).toMatchSnapshot();
    });
});
