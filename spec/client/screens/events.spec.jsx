import React from 'react'; // eslint-disable-line no-unused-vars
import EventModel from 'sm/models/event';
import EventEditForm from 'sm/screens/events/edit-form';
import EVENT from '../../fixtures/sm/event/1.json';

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
