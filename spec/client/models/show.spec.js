import Show from 'sm/models/show';
import DateRange from 'hippo/lib/date-range';
import chronokinesis from 'chronokinesis';
import moment from 'moment-timezone';

describe('Model Show', () => {
    beforeEach(() => {
        moment.tz.setDefault('America/Los_Angeles');
        chronokinesis.travel(new Date('2017-05-01'));
    });
    afterEach(() => {
        chronokinesis.reset();
    });

    it('can be instantiated', () => {
        const model = new Show(fixture('show').first);
        expect(model).toBeInstanceOf(Show);
        expect(model.serialize()).toMatchObject({
            description: 'feat. Laury Schaden',
            title: 'Amelie Willms with foxtrot whisky tango',
        });
    });

    it('serializes duration', () => {
        const model = new Show();
        model.visible_during = '2017-07-26 15:30:15 UTC...2017-08-03 15:30:15 UTC';
        expect(model.visible_during).toBeInstanceOf(DateRange);
        expect(model.visible_during.start.toISOString()).toEqual('2017-07-26T15:30:15.000Z');
        expect(model.visible_during.end.toISOString()).toEqual('2017-08-03T15:30:15.000Z');
        expect(model.serialize()).toMatchObject({
            visible_during: '[2017-07-26T15:30:15.000Z,2017-08-03T15:30:15.000Z)',
        });
    });

    it('#commonTime', () => {
        const show = new Show({
            times: [
                { occurs_at: '2017-07-26T15:45:15.000Z' },
                { occurs_at: '2017-08-03T15:30:15.000Z' },
            ],
        });
        expect(show.commonTime).toBeNull();
        show.times[0].occurs_at = '2017-07-26T15:30:15.000Z';
        expect(show.commonTime).toEqual('8:30am');
    });
});
