import React from 'react';

import { observer } from 'mobx-react';

import { invoke, extend } from 'lodash';
import { Row, Col } from 'react-flexbox-grid';

import Braintree from './settings/braintree';

import { autobind } from 'core-decorators';

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
