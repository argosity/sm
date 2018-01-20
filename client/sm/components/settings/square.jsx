import React from 'react';
import PropTypes from 'prop-types';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Box, Text, Anchor, Button } from 'grommet';
import PopoutWindow from 'hippo/components/popout-window';
import Extensions from 'hippo/extensions';
import Tenant from 'hippo/models/tenant';
import NetworkActivityOverlay from 'hippo/components/network-activity-overlay';
import SquareAuth from '../../models/square-auth';

@observer
export default class SquareConfig extends React.Component {

    static propTypes = {
        registerForSave: PropTypes.func.isRequired,
    }

    @observable auth = new SquareAuth()

    @observable isLinking = false;

    componentDidMount() {
        this.auth.fetch();
    }

    onSave() {
        this.auth.save();
    }

    @action.bound openLink() {
        this.isLinking = true;
    }

    @action.bound onLinkWindowClose() {
        this.isLinking = false;
        this.auth.update(this.popOpen.popup.square);
        this.auth.save();
    }

    renderLinkWindow() {
        if (!this.isLinking) { return null; }
        const url = `${Extensions.get('sm').data.payments.square.url}&state=${Tenant.current.slug}`;
        return (
            <PopoutWindow
                title="Link Square Account"
                ref={(r) => { this.popOpen = r; }}
                url={url}
                onClose={this.onLinkWindowClose}
                options={{
                    height: 700,
                    width: 700,
                }}
            ><span/></PopoutWindow>
        );
    }

    renderLinked() {
        return (
            <Box direction="row" justify="between" align="center">
                <Text>
                    Linked to Square location “{this.auth.location_name}”.
                </Text>
                <Button margin="small" onClick={this.openLink} label="Re-link" />
            </Box>
        );
    }

    renderNewLink() {
        return <Anchor onClick={this.openLink}>Link Square Account</Anchor>;
    }

    render() {
        return (
            <Box margin={{ vertical: 'medium', horizontal: 'small' }}>
                <NetworkActivityOverlay model={this.auth} />
                {this.auth.isAuthorized ? this.renderLinked() : this.renderNewLink()}
                {this.renderLinkWindow()}
            </Box>
        );
    }

}
