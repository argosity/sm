import Event from 'sh/models/event';

describe('Model Event', () => {

    it('can be instantiated', () => {
        const model = new Event();
        expect(model).toBeInstanceOf(Event);
    });

});
