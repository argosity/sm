import React from 'react';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';
import { invoke, extend } from 'lodash';

import Braintree from './settings/braintree';


@observer
export default class SMSystemSettings extends React.PureComponent {
    childrenRefs = new Map();

    onSave() {
        this.childrenRefs.forEach(panel => invoke(panel, 'onSave'));
    }


    @autobind
    onChildMount(id, child) {
        this.childrenRefs.set(id, child);
    }

    componentDidMount() {
        this.props.registerForSave(this);
    }

    render() {
        const childProps = extend({}, this.props, {
            registerForSave: this.onChildMount,
        });

        return (
            <div>
                <Braintree {...childProps} />
            </div>
        );
    }
}
