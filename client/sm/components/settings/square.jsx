import React from 'react';
import PropTypes from 'prop-types';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { get } from 'lodash';

import Anchor from 'grommet/components/Anchor';
import PopoutWindow from 'hippo/components/popout-window';
import Extensions from 'hippo/extensions';
import Tenant from 'hippo/models/tenant';
import SquareConfigModel from '../../models/square-config';

const KEY = 'square';

@observer
export default class SquareConfig extends React.PureComponent {

    static propTypes = {
        registerForSave: PropTypes.func.isRequired,
    }

    config = new SquareConfigModel()

    @observable isLinking = false;

    componentWillMount() {
        this.props.registerForSave('sqc', this);
        this.setFields(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setFields(nextProps);
    }

    setFields(props) {
        const config = get(props, `settings.${KEY}`, {});
        this.config.set(config);
    }

    onSave() {
        this.props.settings[KEY] = this.config.serialize();
    }

    @action.bound openLink() {
        this.isLinking = true;
    }

    @action.bound onLinkWindowClose() {
        this.config.update(this.popOpen.popup.square);
        this.isLinking = false;
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
            <div>
                Linked to Square. <Anchor onClick={this.openLink}>Re-link</Anchor>
            </div>
        );
    }

    renderNewLink() {
        return <Anchor onClick={this.openLink}>Link Square Account</Anchor>;
    }

    render() {
        return (
            <div>
                {this.config.isAuthorized ? this.renderLinked() : this.renderNewLink()}
                {this.renderLinkWindow()}
            </div>
        );
    }

}
