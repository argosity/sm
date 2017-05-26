import React from 'react';
import PropTypes from 'prop-types';
import Image from './image';
import { observer } from 'mobx-react';
import { action, observable, computed } from 'mobx';
import PresenterModel from '../../models/embed/presenter';


@observer
export default class Event extends React.PureComponent {
    static propTypes = {
        presenter: PropTypes.instanceOf(PresenterModel),
    }

    render() {
        const { presenter } = this.props;
        if (!presenter) { return null; }
        return presenter.logo ? <Image image={presenter.logo} size="thumbnail" /> : (
            <h3 className="presenter">{presenter.name}</h3>
        );
    }
}
