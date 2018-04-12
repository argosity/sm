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
        console.log(stats.chartData);
    });
});
