import { React, Snapshot, getScreenInstance } from 'lanes/testing/index';
import Embeds from 'sm/screens/embeds';

const screenInstance = getScreenInstance('embeds');

describe('Screen Embeds', () => {
    it('renders and matches snapshot', () => {
        const screen = shallow(<Embeds screen={screenInstance} />);
        expect(screen).toHaveRendered('Embeds');
        expect(Snapshot(<Embeds screen={screenInstance} />)).toMatchSnapshot();
    });
});
