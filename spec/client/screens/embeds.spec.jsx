import React from 'react'; // eslint-disable-line no-unused-vars
import { Snapshot, getScreenInstance } from 'hippo/testing/index';
import Embeds from 'sm/screens/embeds';

const screenInstance = getScreenInstance('embeds');

describe('Screen Embeds', () => {
    it('renders and matches snapshot', () => {
        expect(Snapshot(<Embeds screen={screenInstance} />)).toMatchSnapshot();
    });
});
