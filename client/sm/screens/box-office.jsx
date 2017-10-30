import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import moment from 'moment';
import Button           from 'grommet/components/Button';
import Box              from 'grommet/components/Box';
import TicketIcon       from 'grommet/components/icons/base/Ticket';
import CreditCardIcon   from 'grommet/components/icons/base/CreditCard';
import SearchIcon       from 'grommet/components/icons/base/Search';
import DocumentDownload from 'grommet/components/icons/base/DocumentDownload';
import Screen     from 'hippo/components/screen';
import Query      from 'hippo/models/query';
import QueryLayer from 'hippo/components/record-finder/query-layer';
import ShowTime from '../models/show-time';
import GuestList from './box-office/guest-list';
import Sale from '../models/sale';
import SaleLayer from '../components/sale/layer';
import './box-office/box-office.scss';

const DateCell = ({ cellData }) => moment(cellData).format('YYYY-MM-DD hh:mma');

@observer
export default class BoxOffice extends React.PureComponent {

    static propTypes = {
        screen: PropTypes.instanceOf(Screen.Instance).isRequired,
    }

    @observable time = new ShowTime();
    @observable isShowingSearch = false;
    @observable sale;

    query = new Query({
        src: ShowTime,
        syncOptions: { include: 'show', with: { purchasable: true }, order: { occurs_at: 'desc' } },
        fields: [
            { id: 'id', visible: false, queryable: false },
            { id: 'shows.title', label: 'Title', flexGrow: 1 },
            {
                id: 'occurs_at', cellRenderer: DateCell, flexGrow: 0, width: 160, textAlign: 'right',
            },
        ],
    })

    componentDidMount() {
        this.query.fetchSingle({ id: 1 }).then(o => this.onRecordFound(o));
    }

    @action.bound
    onRecordFound(time) {
        this.time = time;
        this.isShowingSearch = false;
    }
    @action.bound onSaleClick() {
        this.sale = new Sale({ time: this.time });
    }
    @action.bound onSaleComplete() {
        this.guestList.ux.addSale(this.sale);
        this.sale = null;
    }
    @action.bound onCompTickets() {
        this.sale = new Sale({ time: this.time, noCharge: true });
    }

    @action.bound onSaleCancel() { this.sale = null; }
    @action.bound onSearchClick() { this.isShowingSearch = true; }
    @action.bound onSearchClose() { this.isShowingSearch = false; }

    @action.bound setGuestList(gl) {
        this.guestList = gl;
    }

    renderDetails() {
        if (this.time.isNew) { return null; }
        return (
            <div>
                <span>{moment(this.time.occurs_at).format('dddd, MMMM Do YYYY, h:mm:ss a')}</span>
                <Button plain icon={<DocumentDownload />} href={this.time.xlsURL} />
                <Button
                    icon={<TicketIcon />}
                    onClick={this.onCompTickets}
                />
                <Button
                    icon={<CreditCardIcon />}
                    onClick={this.onSaleClick}
                />

            </div>
        );
    }

    renderControls() {
        if (this.time.isNew) { return null; }

        return (
            <Box direction="row" justify="end">
            </Box>
        );
    }

    render() {
        const { time, query, isShowingSearch } = this;

        return (
            <Screen screen={this.props.screen}>
                <QueryLayer
                    query={query}
                    title={'Find Show'}
                    visible={isShowingSearch}
                    onRecordSelect={this.onRecordFound}
                    onClose={this.onSearchClose}
                />

                <SaleLayer
                    sale={this.sale}
                    onCancel={this.onSaleCancel}
                    onComplete={this.onSaleComplete}
                />
                <Box direction="row" wrap justify="between" align="baseline">
                    <Button
                        plain
                        className="grommetux-control-icon-search"
                        icon={<SearchIcon />}
                        label={time.isNew ? 'Click to find Show' : time.show.title}
                        onClick={this.onSearchClick}
                    />
                    <div>
                        {this.renderDetails()}
                    </div>
                </Box>
                <GuestList ref={this.setGuestList} time={time} />
            </Screen>
        );
    }

}
