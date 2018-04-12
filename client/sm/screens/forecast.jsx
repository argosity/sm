import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { Box } from 'grommet';
import { Toolbar } from 'hippo/components/toolbar';
import Screen from 'hippo/components/screen';
import Value from 'hippo/components/value';
import Chart from 'hippo/components/chart';
import NetworkActivity from 'hippo/components/network-activity-overlay';
import ShowTimeStats from '../models/show-time-stats';
import ShowTimeFinder from '../components/show-time-finder';


@observer
export default class Forecast extends React.Component {

    static propTypes = {
        screen: PropTypes.instanceOf(Screen.Instance).isRequired,
    }

    stats = new ShowTimeStats();

    @action.bound onShowFound(showTime) {
        this.stats.showTime = showTime;
        this.stats.id = showTime.id;
        this.stats.fetch();
    }

    @action.bound onComparisonFound(showTime) {
        this.stats.compareTo(showTime);
    }

    chartOptions = {
        axisX: {
            labelInterpolationFnc(value, index) {
                return 0 === index % 2 ? value : null;
            },
        },
    };

    renderStats() {
        const { stats } = this;

        return (
            <Box>
                <Box direction="row">
                    <ShowTimeFinder
                        onShowFound={this.onComparisonFound}
                        label={st => (st && st.show ? `Comparing to ${st.show.title}` : 'Compare to Show')}
                    />
                </Box>
                <Box gap="small" direction="row" justify="center">
                    <Value label="Sales" value={stats.sales} />
                    <Value label="Checked In" value={stats.redemptions} />
                </Box>
                <Chart options={this.chartOptions} data={stats.chartData} type="Line" />
            </Box>
        );
    }

    render() {
        const { stats } = this;

        return (
            <Screen screen={this.props.screen}>
                <Toolbar>
                    <ShowTimeFinder onShowFound={this.onShowFound} />
                </Toolbar>
                <NetworkActivity model={stats} />
                { !stats.isNew && this.renderStats() }
            </Screen>
        );
    }

}
