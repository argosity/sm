import { React, Snapshot, getScreenInstance } from 'hippo/testing/index'; // eslint-disable-line no-unused-vars
import Forecast from 'sm/screens/forecast';

const screenInstance = getScreenInstance('forecast');

describe('Screen Forecast', () => {
    it('renders and matches snapshot', () => {
        const fc = mount(<Forecast screen={screenInstance} />);
        expect(fc).toHaveRendered('Forecast');
        expect(Snapshot(<Forecast screen={screenInstance} />)).toMatchSnapshot();
    });
});
