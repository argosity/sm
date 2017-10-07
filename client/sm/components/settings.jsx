import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { autobind } from 'core-decorators';
import { invoke, extend } from 'lodash';

import Select from 'grommet/components/Select';
import { Row, Col } from 'react-flexbox-grid'
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Braintree from './settings/braintree';
import Square from './settings/square';
import Extension from '../extension';
import Extensions from 'hippo/extensions';

const PaymentVendors = {
    Braintree,
    Square,
}


@observer
export default class SMSystemSettings extends React.PureComponent {

    childrenRefs = new Map();

    onSave() {
        this.props.settings.paymentsVendor = this.paymentVendor;
        this.childrenRefs.forEach(panel => invoke(panel, 'onSave'));
        Extensions.get('sm').data.payments.vendor = this.paymentVendor;
    }

    @computed get paymentVendor() {
        return this.props.settings.paymentsVendor;
    }

    @autobind
    onChildMount(id, child) {
        this.childrenRefs.set(id, child);
    }

    componentDidMount() {
        this.props.registerForSave(this);
    }

    @action.bound setPaymentVendor({ option }) {
        this.props.settings.paymentsVendor = option;
    }

    renderPaymentVendor() {
        if (!this.paymentVendor) { return null; }
        const Tag = PaymentVendors[this.paymentVendor];
        const childProps = extend({}, this.props, {
            registerForSave: this.onChildMount,
        });
        return <Tag {...childProps} />;
    }

    render() {
        return (
            <div>
                <Box
                    direction='row'
                    align='center'
                    pad={{ between: 'large' }}
                >
                    <Heading tag="h3">
                        Payment vendor:
                    </Heading>
                    <Select
                        placeHolder=''
                        options={['Braintree', 'Square']}
                        value={this.paymentVendor}
                        onChange={this.setPaymentVendor}
                    />
                </Box>
                {this.renderPaymentVendor()}

            </div>
        );
    }

}
