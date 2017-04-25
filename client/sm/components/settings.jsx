import React from 'react';

import { observer } from 'mobx-react';

import { Row, Col } from 'react-flexbox-grid';

import BtConfig from './bt-config';

@observer
export default class SMSystemSettings extends React.PureComponent {

    onSave() {
        if (this.btConfig) {
            this.btConfig.onSave();
        }
    }

    componentDidMount() {
        this.props.registerForSave(this);
    }

    render() {
        return (
            <div>
                <BtConfig
                    {...this.props}
                    registerForSave={panel => (this.btConfig = panel)}
                />
            </div>
        );
    }

}
