import Event from 'sm/models/event';

describe('Model Event', () => {
    it('can be instantiated', () => {
        const model = new Event(fixture('event').first);
        expect(model).toBeInstanceOf(Event);
        expect(model.serialize()).toMatchObject({
            description: 'feat. Laury Schaden',
            title: 'Amelie Willms with foxtrot whisky tango',
        });
    });

    it('serializes', () => {
        const model = new Event();
        model.update({ visible_after: '2017-03-12T16:26:34.374Z' });
        expect(model.serialize()).toMatchObject({ visible_after: '2017-03-12T16:26:34.374Z' });
    });
});
