import Event from 'sm/models/event';
import chronokinesis from 'chronokinesis';
import moment from 'moment';

describe('Model Event Occurrence', () => {
    beforeEach(() => {
        chronokinesis.travel(new Date('2017-05-01'));
    });
    afterEach(() => {
        chronokinesis.reset();
    });

    fit('#occurrencesString', () => {
        const event = new Event({ occurrences: [
            { occurs_at: '2017-07-26T15:45:15.000Z' },
            { occurs_at: '2017-08-03T15:30:15.000Z' },
        ] });
        expect(event.occurrences[0].formattedOccursAt).toEqual(
            `${moment(event.occurrences[0].occurs_at).format('h:mma MMM Do YYYY')}`,
        );
        expect(event.occurrences[1].formattedOccursAt).toEqual(
            `${moment(event.occurrences[1].occurs_at).format('h:mma MMM Do YYYY')}`,
        );
        event.occurrences[1].occurs_at = new Date('2017-07-26T15:45:15.000Z');
        expect(event.occurrences[0].formattedOccursAt).toEqual(
            `${moment(event.occurrences[0].occurs_at).format('MMM Do YYYY')}`,
        );
    });
});
