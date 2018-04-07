import moment from 'moment';
import { sortBy, range, map, last, first, sumBy } from 'lodash';
import {
    BaseModel, identifiedBy, identifier,  session, computed,
} from './base';


@identifiedBy('sm/show-time/stats')
export default class ShowTimeStats extends BaseModel {

    @identifier id;
    @session redemptions;
    @session sales;
    @session({ type: 'object' }) timeline;

    @computed get chartData() {
        const values = sortBy(map(this.timeline,
            ([timestamp, qty]) => ({
                date: moment(timestamp * 1000), qty,
            })), 'date');

        const min = first(values).date;
        const max = last(values).date;
        let runningQty = 0;
        const labels = [];
        const series = [[]];
        range(max.diff(min, 'days')).forEach((d) => {
            const day = min.clone().add(d, 'day');

            runningQty += sumBy(values, sale => (
                sale.date.isSame(day, 'day') ? sale.qty : 0
            ));
            labels.push(day.format('D/M/YY'));
            series[0].push(runningQty);
        });
        return { labels, series };
    }

}
