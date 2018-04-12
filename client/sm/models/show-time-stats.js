import moment from 'moment';
import {
    sortBy, range, map, last, first, values,
    sumBy, isEmpty, mapValues, groupBy,
} from 'lodash';
import {
    BaseModel, identifiedBy, identifier,  session, computed, action, field,
} from './base';

const ISO_FORMAT = 'YYYYMMDD';

@identifiedBy('sm/show-time/stats')
export default class ShowTimeStats extends BaseModel {

    @identifier id;
    @field compareToId;

    @session showTime;
    @session redemptions;
    @session sales;
    @session({ type: 'object' }) timeline = [];
    @session({ type: 'object' }) comparison_timeline = [];

    @action compareTo(time) {
        this.fetch({ query: { compare_to_id: time.id } });
    }

    normalizedTimeLine(timeline) {
        return mapValues(
            groupBy(
                map(
                    sortBy(timeline, '0'),
                    ([timestamp, qty]) => ({ date: moment(timestamp * 1000), qty }),
                ),
                ({ date }) => date.format(ISO_FORMAT),
            ),
            days => ({ date: days[0].date, qty: sumBy(days, 'qty') }),
        );
    }

    @computed get chartData() {
        if (isEmpty(this.timeline)) {
            return { labels: [], series: [] };
        }
        const timeline = this.normalizedTimeLine(this.timeline);
        const compare = isEmpty(this.comparison_timeline) ?
            null : this.normalizedTimeLine(this.comparison_timeline);

        const days = values(timeline);
        const day = first(days).date;

        let runningQty = 0;
        let runningCompare = 0;

        const labels = [];
        const series = [[]];
        if (compare) { series.push([]); }

        range(last(days).date.diff(day, 'days') + 1).forEach(() => {
            const key = day.format(ISO_FORMAT);
            let c = timeline[key];
            labels.push(day.format('D/M/YY'));
            series[0].push(runningQty += (c ? c.qty : 0));
            if (compare) {
                c = compare[key];
                series[1].push(runningCompare += (c ? c.qty : 0));
            }
            day.add(1, 'day');
        });
        return { labels, series };
    }

}
