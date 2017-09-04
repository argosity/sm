import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Image from './image';
import PresenterModel from '../../models/presenter';

@observer
export default class Show extends React.PureComponent {
    static propTypes = {
        presenter: PropTypes.instanceOf(PresenterModel),
    }

    render() {
        const { presenter } = this.props;
        if (!presenter) { return null; }
        return presenter.logo.exists ? (
            <Image image={presenter.logo} className="presenter" size="thumbnail" />
        ) : (
            <h3 className="presenter">{presenter.name} presents:</h3>
        );
    }
}
