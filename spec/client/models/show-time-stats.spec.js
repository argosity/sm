import ShowTimeStats from 'sm/models/show-time-stats';
import Show from 'sm/models/show';

describe(ShowTimeStats, () => {
    let stats;
    let show;

    beforeEach(() => {
        stats = new ShowTimeStats();
        show = new Show({
            times: [
                { occurs_at: '2018-03-30T15:45:15.000Z' },
            ],
        });
        [stats.showTime] = show.times;
        stats.timeline = [
            [1521773152, 8], [1521773152, 1], [1521773152, 2], [1521773152, 2],
            [1520473821, 1], [1520473821, 4], [1520473821, 1], [1520473821, 3],
            [1520473821, 2], [1520473821, 3], [1520473821, 4], [1520473821, 2],
        ];
    });

    it('#chartData', () => {
        expect(stats.chartData.labels).toEqual([
            '7/3/18', '8/3/18', '9/3/18', '10/3/18', '11/3/18',
            '12/3/18', '13/3/18', '14/3/18', '15/3/18', '16/3/18',
            '17/3/18', '18/3/18', '19/3/18', '20/3/18', '21/3/18', '22/3/18',
        ]);
    });
});
