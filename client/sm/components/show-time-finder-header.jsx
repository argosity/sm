import React from 'react';
import PropTypes from 'prop-types';
import { Button, Box } from 'grommet';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { Search } from 'grommet-icons';
import { get } from 'lodash';
import moment from 'moment';
import { Toolbar } from 'hippo/components/toolbar';
import Query      from 'hippo/models/query';
import QueryLayer from 'hippo/components/record-finder/query-layer';
import ShowTime from '../models/show-time';

const DateCell = ({ cellData }) => moment(cellData).format('YYYY-MM-DD hh:mma');

@observer
export default class ShowTimeFinderHeader extends React.Component {

    static propTypes = {
        onShowFound: PropTypes.func.isRequired,
    }

    @observable time = new ShowTime();
    @observable isShowingSearch = false;
    @action.bound onSearchClick() {
        this.query.reset();
        this.isShowingSearch = true;
    }
    @action.bound onSearchClose() { this.isShowingSearch = false; }

    query = new Query({
        src: ShowTime,
        syncOptions: { include: 'show', with: 'purchasable', order: { occurs_at: 'desc' } },
        fields: [
            { id: 'id', visible: false, queryable: false },
            { id: 'shows.title', label: 'Title', flexGrow: 1 },
            {
                id: 'occurs_at', cellRenderer: DateCell, flexGrow: 0, width: 160, textAlign: 'right',
            },
        ],
    })

    @action.bound
    onRecordFound(time) {
        this.time = time;
        this.isShowingSearch = false;
        this.props.onShowFound(time);
    }

    renderDetails() {
        if (this.time.isNew) { return null; }
        return (
            <Box
                style={{ flex: '1  0 auto', paddingLeft: '12px' }}
                direction="row-responsive" align="center"
            >
                <span>
                    {moment(this.time.occurs_at).format('h:mma ddd, MMM D')}
                </span>
                <Box
                    style={{ flex: '1  0 auto' }}
                    direction="row" responsive={false} flex justify="end"
                >
                    {this.props.children}
                </Box>
            </Box>
        );
    }

    render() {
        return (
            <Toolbar>
                <QueryLayer
                    query={this.query}
                    title={'Find Show'}
                    visible={this.isShowingSearch}
                    onRecordSelect={this.onRecordFound}
                    onClose={this.onSearchClose}
                />
                <Button
                    color="transparent"
                    className="grommetux-control-icon-search"
                    icon={<Search />}
                    label={get(this.time, 'show.title', 'Click to find Show')}
                    onClick={this.onSearchClick}
                />
                {this.renderDetails()}
            </Toolbar>
        );
    }

}
