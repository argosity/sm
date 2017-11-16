import React from 'react';
import PropTypes from 'prop-types';
import { computed, action } from 'mobx';
import Button from 'grommet/components/Button';
import LinkIcon from 'grommet/components/icons/base/Link';
import CircleInformationIcon from 'grommet/components/icons/base/CircleInformation';

import ShowModel from '../../models/show';

export default class InfoButton extends React.Component {

    static propTypes = {
        show: PropTypes.instanceOf(ShowModel),
        onClick: PropTypes.func.isRequired,
    }

    @computed get Icon() {
        const { hasPage, external_url } = this.props.show;
        if (external_url) {
            return LinkIcon;
        } else if (hasPage) {
            return CircleInformationIcon;
        }
        return null;
    }

    @action.bound
    onClick(ev) {
        if (!this.props.show.external_url && this.props.show.page) {
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
                href={this.props.show.external_url}
            />
        );
    }

}
