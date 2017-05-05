import { React, Snapshot, getScreenInstance } from 'lanes/testing/index';

import Listing from 'sm/embed/events/listing';

describe('Embedded Events Listing', () => {

    let events;

    beforeEach(() => {
        events = []
    });


    it('renders and matches snapshot', function() {
        const listing = mount(<Listing events={events} />);
        expect(Snapshot(<Listing events={events} />).toMatchSnapshot();
    });

});
