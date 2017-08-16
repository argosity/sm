import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import moment from 'moment';
import Screen from 'hippo/components/screen';
import Query from 'hippo/models/query';
import QueryLayer from 'hippo/components/record-finder/query-layer';
import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';
import CreditCardIcon from 'grommet/components/icons/base/CreditCard';
import SearchIcon from 'grommet/components/icons/base/Search';
import EventOccurrence from '../models/event_occurrence';
import Attendees from './box-office/attendees';
import './box-office/box-office.scss';
import Occurrence from '../models/event_occurrence';


const DateCell = ({ cellData }) => moment(cellData).format('YYYY-MM-DD hh:mma');

@observer
export default class BoxOffice extends React.PureComponent {

    static propTypes = {
        screen: PropTypes.instanceOf(Screen.Instance).isRequired,
    }

    @observable occurrence = new EventOccurrence;
    @observable isShowingSearch = false;

    query = new Query({
        src: Occurrence,
        syncOptions: { include: 'event', order: { occurs_at: 'desc' } },
        fields: [
            { id: 'id', visible: false, queryable: false },
            { id: 'events.title', label: 'Title', flexGrow: 1 },
            { id: 'occurs_at', cellRenderer: DateCell, flexGrow: 0, width: 160, textAlign: 'right' },
        ],
    })

    @action.bound
    onRecordFound(occur) {
        this.occurrence = occur;
        this.isShowingSearch = false;
    }

    @action.bound
    onSaleClick() {

    }

    @action.bound onSearchClick() { this.isShowingSearch = true; }
    @action.bound onSearchClose() { this.isShowingSearch = false; }

    componentDidMount() {
        this.query.fetchSingle({ id: 351 })
            .then(o => this.onRecordFound(o));
    }

    render() {
        const { occurrence, query, isShowingSearch } = this;

        return (
            <Screen screen={this.props.screen}>
                <QueryLayer
                    query={query}
                    title={'Find Event'}
                    visible={isShowingSearch}
                    onRecordSelect={this.onRecordFound}
                    onClose={this.onSearchClose}
                />

                <Box direction="row" wrap justify="between" align="baseline">
                    <h3>
                        <Button
                            plain
                            className="grommetux-control-icon-search"
                            icon={<SearchIcon />}
                            label={occurrence.isNew ? 'Click to find Event' : occurrence.event.title}
                            onClick={this.onSearchClick}
                        />
                    </h3>
                    <div>
                        {occurrence.isNew ? '' : moment(occurrence.occurs_at).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                    </div>
                </Box>

                <Box direction="row" justify="end">
                    {occurrence.isNew ? null : (
                     <Button
                         icon={<CreditCardIcon />}
                         label={'Sale'}
                         onClick={this.onSaleClick}
                    />)}
                </Box>

                <Attendees occurrence={occurrence} />
            </Screen>
        );
    }
}
