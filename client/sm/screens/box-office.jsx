import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { get } from 'lodash';
import { action, observable } from 'mobx';
import moment from 'moment';
import Button           from 'grommet/components/Button';
import Box              from 'grommet/components/Box';
import { Camera, Ticket, CreditCard, Search, DocumentDownload } from 'grommet-icons';
import Screen     from 'hippo/components/screen';
import Query      from 'hippo/models/query';
import QueryLayer from 'hippo/components/record-finder/query-layer';
import ShowTime from '../models/show-time';
import GuestList from './box-office/guest-list';
import Sale from '../models/sale';
import SaleLayer from '../components/sale/layer';
import MobileApp from '../lib/mobile-app-support';

import './box-office/box-office.scss';

const DateCell = ({ cellData }) => moment(cellData).format('YYYY-MM-DD hh:mma');

@observer
export default class BoxOffice extends React.Component {

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
        // for debugging
        // this.query.fetchSingle({ id: 1 }).then(o => this.onRecordFound(o));
        MobileApp.on('barcodeScan', this.onBarcodeScan);
    }

    componentWillUnmount() {
        MobileApp.off('barcodeScan', this.onBarcodeScan);
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

    @action.bound onBarcodeScan({ data: ticket }) {
        this.guestList.ux.checkInTicket(ticket);
    }

    renderXlsBtn() {
        if (MobileApp.isReal) { return null; }
        return (
            <Button plain icon={<DocumentDownload />} href={this.time.xlsURL} />
        );
    }

    renderMobileScan() {
        if (!MobileApp.isReal) { return null; }

        return (
            <Button
                icon={<Camera />}
                onClick={MobileApp.startBarcodeScan}
            />
        );
    }

    renderDetails() {
        if (this.time.isNew) { return null; }
        return (
            <Box
                style={{ flex: '1  0 auto', paddingLeft: '12px' }}
                direction="row" align="center" responsive={false}
            >
                <span>
                    {moment(this.time.occurs_at).format('h:mma ddd, MMM D')}
                </span>
                <Box
                    style={{ flex: '1  0 auto' }}
                    direction="row" responsive={false} flex justify="end"
                >
                    {this.renderXlsBtn()}
                    <Button
                        icon={<Ticket />}
                        onClick={this.onCompTickets}
                    />
                    <Button
                        icon={<CreditCard />}
                        onClick={this.onSaleClick}
                    />
                    {this.renderMobileScan()}
                </Box>
            </Box>
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
                <Box
                    responsive={false} direction="row" wrap
                    justify="between" align="baseline"
                >
                    <Button
                        plain
                        className="grommetux-control-icon-search"
                        icon={<Search />}
                        label={get(time, 'show.title', 'Click to find Show')}
                        onClick={this.onSearchClick}
                    />
                    {this.renderDetails()}
                </Box>
                <GuestList ref={this.setGuestList} time={time} />
            </Screen>
        );
    }

}
