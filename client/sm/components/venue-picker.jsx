import React from 'react';
import { map } from 'lodash';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import Select from 'grommet/components/Select';

import Venue from '../models/venue';

@observer
export default class VenuePicker extends React.PureComponent {

    @observable collection = Venue.sharedCollection

    @action.bound
    onSelect() {

    }

    render() {
        return (
            <Select
                placeHolder='None'
                inline={false}
                options={ map(this.collection, 'name') }
                value={undefined}
                onChange={this.onSelect} />
        );
    }

}
