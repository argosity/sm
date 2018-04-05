import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { Box } from 'grommet';
import Screen from 'hippo/components/screen';
import Value from 'hippo/components/value';
import NetworkActivity from 'hippo/components/network-activity-overlay';
import ShowTimeStats from '../models/show-time-stats';
import ShowTimeHeader from '../components/show-time-finder-header';

@observer
export default class Forecast extends React.Component {

    static propTypes = {
        screen: PropTypes.instanceOf(Screen.Instance).isRequired,
    }

    stats = new ShowTimeStats();

    @action.bound onShowFound(showTime) {
        this.stats.id = showTime.id;
        this.stats.fetch();
    }

    renderStats() {
        const { stats } = this;
        return (
            <Box gap="small" direction="row" justify="center">
                <Value label="Sales" value={stats.sales} />
                <Value label="Checked In" value={stats.redemptions} />
            </Box>
        );
    }

    render() {
        const { stats } = this;

        return (
            <Screen screen={this.props.screen}>
                <ShowTimeHeader onShowFound={this.onShowFound} />
                <NetworkActivity model={stats} />
                { !stats.isNew && !stats.syncInProgress && this.renderStats() }

            </Screen>
        );
    }

}
