import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { Button, Box } from 'grommet';
import { Camera, Ticket, CreditCard, DocumentDownload } from 'grommet-icons';
import Screen     from 'hippo/components/screen';
import ShowTimeHeader from '../components/show-time-finder-header';
import ShowTime from '../models/show-time';
import GuestList from './box-office/guest-list';
import Sale from '../models/sale';
import SaleLayer from '../components/sale/layer';
import MobileApp from '../lib/mobile-app-support';
import StyledBoxOffice from './box-office/styled-box-office';

@observer
export default class BoxOffice extends React.Component {

    static propTypes = {
        screen: PropTypes.instanceOf(Screen.Instance).isRequired,
    }

    @observable time = new ShowTime();

    @observable sale;


    componentDidMount() {
        // for debugging
        // this.query.fetchSingle({ id: 1 }).then(o => this.onShowFound(o));
        MobileApp.on('barcodeScan', this.onBarcodeScan);
    }

    componentWillUnmount() {
        MobileApp.off('barcodeScan', this.onBarcodeScan);
    }

    @action.bound
    onShowFound(time) {
        this.time = time;
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

    @action.bound setGuestList(gl) {
        this.guestList = gl;
    }

    @action.bound onBarcodeScan({ data: ticket }) {
        this.guestList.ux.checkInTicket(ticket);
    }

    renderXlsBtn() {
        if (MobileApp.isReal) { return null; }
        return (
            <Button title="Download as spreadsheet" plain icon={<DocumentDownload />} href={this.time.xlsURL} />
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
        return (
            <Box
                style={{ flex: '1  0 auto' }}
                direction="row" responsive={false} flex justify="end"
            >
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
        const { time } = this;

        return (
            <Screen screen={this.props.screen}>

                <StyledBoxOffice>
                    <SaleLayer
                        sale={this.sale}
                        onCancel={this.onSaleCancel}
                        onComplete={this.onSaleComplete}
                    />
                    <ShowTimeHeader onShowFound={this.onShowFound}>
                        {this.renderControls()}
                    </ShowTimeHeader>
                    <GuestList ref={this.setGuestList} time={time} />
                </StyledBoxOffice>
            </Screen>
        );
    }

}
