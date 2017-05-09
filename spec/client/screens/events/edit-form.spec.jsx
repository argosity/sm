import { React, Snapshot, getScreenInstance } from 'hippo/testing/index';

import EventModel from 'sm/models/event';
import EventEditForm from 'sm/screens/events/edit-form';
import EVENT from '../../../fixtures/sm/event/1.json';

// import Events from 'sm/screens/events';
// const screenInstance = getScreenInstance('events');

describe('Screen Events', () => {
    let props;
    let event;
    beforeEach(() => {
        event = new EventModel(EVENT);
        props = {
            event,
            onComplete: jest.fn(),
        };
    });

    it('edits', () => {
        const form = mount(<EventEditForm {...props} />);
        form.find('TextInput input[name="title"]').simulate('change', { target: { value: 'NEW NAME' } });
        form.find('button.grommetux-button--primary').simulate('click');
        expect(event.title).toEqual('NEW NAME');
    });
});
