import React from 'react'; // eslint-disable-line no-unused-vars
import ShowModel from 'sm/models/show';
import ShowEditForm from 'sm/screens/shows/edit-form';
import SHOW from '../../fixtures/sm/show/1.json';

describe('Screen Shows', () => {
    let props;
    let show;
    beforeEach(() => {
        show = new ShowModel(SHOW);
        props = {
            show,
            onComplete: jest.fn(),
        };
    });

    xit('edits', () => {
        const form = mount(<ShowEditForm {...props} />);
        form.find('TextInput input[name="title"]').simulate('change', { target: { value: 'NEW NAME' } });
        form.find('button.grommetux-button--primary').simulate('click');
        expect(show.title).toEqual('NEW NAME');
    });
});
