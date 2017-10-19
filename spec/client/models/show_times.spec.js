import Show from 'sm/models/show';
import chronokinesis from 'chronokinesis';
import moment from 'moment';

describe('Model ShowTimes Occurrence', () => {
    beforeEach(() => {
        chronokinesis.travel(new Date('2017-05-01'));
    });
    afterEach(() => {
        chronokinesis.reset();
    });

    fit('#occurrencesString', () => {
        const show = new Show({
            times: [
                { occurs_at: '2017-07-26T15:45:15.000Z' },
                { occurs_at: '2017-08-03T15:30:15.000Z' },
            ],
        });
        expect(show.times[0].formattedOccursAt).toEqual(
            `${moment(show.times[0].occurs_at).format('h:mma MMM Do YYYY')}`,
        );
        expect(show.times[1].formattedOccursAt).toEqual(
            `${moment(show.times[1].occurs_at).format('h:mma MMM Do YYYY')}`,
        );
        show.times[1].occurs_at = new Date('2017-07-26T15:45:15.000Z');
        expect(show.times[0].formattedOccursAt).toEqual(
            `${moment(show.times[0].occurs_at).format('MMM Do YYYY')}`,
        );
    });
});
