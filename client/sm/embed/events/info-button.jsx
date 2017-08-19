import React from 'react';
import PropTypes from 'prop-types';
import { computed, action } from 'mobx';
import Button from 'grommet/components/Button';
import LinkIcon from 'grommet/components/icons/base/Link';
import CircleInformationIcon from 'grommet/components/icons/base/CircleInformation';

import EventModel from '../../models/event';

export default class InfoButton extends React.PureComponent {
    static propTypes = {
        event: PropTypes.instanceOf(EventModel),
        onClick: PropTypes.func.isRequired,
    }

    @computed get Icon() {
        const { hasPage, external_url } = this.props.event;
        if (external_url) {
            return LinkIcon;
        } else if (hasPage) {
            return CircleInformationIcon;
        }
        return null;
    }

    @action.bound
    onClick(ev) {
        if (this.props.event.page) {
            ev.preventDefault();
            this.props.onClick();
        }
    }


    render() {
        const { Icon, onClick } = this;
        if (!Icon) { return null; }

        return (
            <Button
                icon={<Icon />}
                label="Information"
                onClick={onClick}
                target="_blank"
                href={this.props.event.external_url}
            />
        );
    }
}
