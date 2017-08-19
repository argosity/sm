import React from 'react'; // eslint-disable-line no-unused-vars
import { getScreenInstance } from 'hippo/testing/index';
import Embeds from 'sm/screens/embeds';

const screenInstance = getScreenInstance('embeds');

describe('Screen Embeds', () => {
    it('renders and matches snapshot', () => {
        const embeds = mount(<Embeds screen={screenInstance} />);
        expect(embeds.exists()).toBe(true);
    });
});
