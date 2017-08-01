import Event from 'sm/models/event';
import DateRange from 'hippo/lib/date-range';

describe('Model Event', () => {
    it('can be instantiated', () => {
        const model = new Event(fixture('event').first);
        expect(model).toBeInstanceOf(Event);
        expect(model.serialize()).toMatchObject({
            description: 'feat. Laury Schaden',
            title: 'Amelie Willms with foxtrot whisky tango',
        });
    });

    it('serializes duration', () => {
        const model = new Event();
        model.visible_during = '2017-07-26 15:30:15 UTC...2017-08-03 15:30:15 UTC';
        expect(model.visible_during).toBeInstanceOf(DateRange);
        expect(model.visible_during.start.toISOString()).toEqual('2017-07-26T15:30:15.000Z');
        expect(model.visible_during.end.toISOString()).toEqual('2017-08-03T15:30:15.000Z');
        expect(model.serialize()).toMatchObject({
            visible_during: '[2017-07-26T15:30:15.000Z,2017-08-03T15:30:15.000Z)',
        });
    });

    it('#commonTime', () => {
        const event = new Event({
            occurrences: [
                { occurs_at: '2017-07-26T15:45:15.000Z' },
                { occurs_at: '2017-08-03T15:30:15.000Z' },
            ],
        });
        expect(event.commonTime).toEqual('');
        event.occurrences[0].occurs_at = '2017-07-26T15:30:15.000Z';
        expect(event.commonTime).toEqual('12:00:00 am');
    });

    it('#occurrencesString', () => {
        const event = new Event({ occurrences: [
            { occurs_at: '2017-07-26T15:45:15.000Z' },
            { occurs_at: '2017-08-03T15:30:15.000Z' },
        ] });
        expect(event.occurrencesString).toEqual('10:45am Jul 26th 2017 and 10:30am Aug 3rd 2017');
        event.occurrences[0].occurs_at = '2017-07-26T15:30:15.000Z';
        expect(event.occurrencesString).toEqual('12:00:00 am on Jul 26th 2017 and Aug 3rd 2017');
    });
});
