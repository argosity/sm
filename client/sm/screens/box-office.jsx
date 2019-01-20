import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { Button, Box } from 'grommet';
import { Camera, Ticket, CreditCard, DocumentDownload } from 'grommet-icons';
import Screen from 'hippo/components/screen';
import { Toolbar } from 'hippo/components/toolbar';
import ShowTimeFinder from '../components/show-time-finder';
import GuestList from './box-office/guest-list';
import Sale from '../models/sale';
import SaleLayer from '../components/sale/layer';
import MobileApp from '../lib/mobile-app-support';
import StyledBoxOffice from './box-office/styled-box-office';
import UX from './box-office/ux';


@observer
export default class BoxOffice extends React.Component {

    static propTypes = {
        screen: PropTypes.instanceOf(Screen.Instance).isRequired,
    }

    @observable sale;

    ux = new UX();

    componentDidMount() {
        // for debugging
        // this.query.fetchSingle({ id: 1 }).then(o => this.onShowFound(o));
        MobileApp.on('barcodeScan', this.onBarcodeScan);
    }

    componentWillUnmount() {
        MobileApp.off('barcodeScan', this.onBarcodeScan);
        this.ux.onUnmount();
    }

    @action.bound
    onShowFound(time) {
        this.ux.update({ time });
    }

    @action.bound onSaleClick() {
        this.sale = new Sale({ time: this.ux.time });
    }

    @action.bound onSaleComplete() {
        this.guestList.ux.addSale(this.sale);
        this.sale = null;
    }

    @action.bound onCompTickets() {
        this.sale = new Sale({ time: this.ux.time, noCharge: true });
    }

    @action.bound onSaleCancel() { this.sale = null; }

    @action.bound setGuestList(gl) {
        this.guestList = gl;
    }

    @action.bound onBarcodeScan({ data: ticket }) {
        this.guestList.ux.checkInTicket(ticket);
    }

    renderXlsBtn() {
        if (MobileApp.isReal) { return null; }
        return (
            <Button title="Download as spreadsheet" plain icon={<DocumentDownload />} href={this.ux.time.xlsURL} />
        );
    }

    renderMobileScan() {
        if (!MobileApp.isReal) { return null; }

        return (
            <Button
                title="Scan ticket"
                icon={<Camera />}
                onClick={MobileApp.startBarcodeScan}
            />
        );
    }

    renderControls() {
        if (!this.ux.time) { return null; }
        return (
            <Box
                style={{ flex: '1  0 auto' }}
                className="navbar-controls"
                direction="row" responsive={false} flex justify="end"
            >
                <span className="qty-sold">
                    <span>{this.ux.qtyRedeemed} / {this.ux.qtySold}</span>
                    <span>checked in</span>
                </span>
                {this.renderXlsBtn()}
                <Button
                    icon={<Ticket />}
                    title="Generate Ticket"
                    onClick={this.onCompTickets}
                />
                <Button
                    icon={<CreditCard />}
                    title="Sale"
                    onClick={this.onSaleClick}
                />
                {this.renderMobileScan()}
            </Box>
        );
    }

    render() {
        const { ux } = this;

        return (
            <Screen screen={this.props.screen}>

                <StyledBoxOffice>
                    <SaleLayer
                        sale={this.sale}
                        onCancel={this.onSaleCancel}
                        onComplete={this.onSaleComplete}
                    />
                    <Toolbar>
                        <ShowTimeFinder onShowFound={this.onShowFound}>
                            {this.renderControls()}
                        </ShowTimeFinder>
                    </Toolbar>
                    <GuestList ref={this.setGuestList} ux={ux} />
                </StyledBoxOffice>
            </Screen>
        );
    }

}
