import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Image from './image';
import VenueModel from '../../models/venue';


function NameOrLogo({ venue }) {
    console.log(venue)
    return venue.logo ? <Image image={venue.logo} size="thumbnail" /> : (
        <span className="name">{venue.name}</span>
    );
}

@observer
export default class Venue extends React.PureComponent {
    static propTypes = {
        venue: PropTypes.instanceOf(VenueModel),
    }

    render() {
        const { venue } = this.props;
        if (!venue) { return null; }

        return (
            <div className="venue">
                <NameOrLogo venue={venue} />
                <span className="address">{venue.address}</span>
            </div>
        );
    }
}
