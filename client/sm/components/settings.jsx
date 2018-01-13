import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { autobind } from 'core-decorators';
import { invoke, extend } from 'lodash';
import { Box, Select } from 'grommet';
import { Heading } from 'hippo/components/form';
import Extensions from 'hippo/extensions';
import Braintree from './settings/braintree';
import Square from './settings/square';

const PaymentVendors = {
    Braintree,
    Square,
};


@observer
export default class SMSystemSettings extends React.Component {

    childrenRefs = new Map();

    onSave() {
        this.props.settings.paymentsVendor = this.paymentsVendor;
        this.childrenRefs.forEach(panel => invoke(panel, 'onSave'));
        Extensions.get('sm').data.payments.vendor = this.paymentsVendor;
    }

    @autobind onChildMount(id, child) {
        this.childrenRefs.set(id, child);
    }

    get paymentsVendor() {
        return this.props.settings.paymentsVendor;
    }

    componentDidMount() {
        this.props.registerForSave(this);
    }

    @action.bound setPaymentsVendor({ option }) {
        this.props.settings.paymentsVendor = option;
        this.forceUpdate();
    }

    renderPaymentsVendor() {
        if (!this.paymentsVendor) { return null; }
        const Tag = PaymentVendors[this.paymentsVendor];
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
                    <Heading>Payment vendor</Heading>
                    <Select
                        placeHolder=''
                        options={['Braintree', 'Square']}
                        value={this.paymentsVendor}
                        onChange={this.setPaymentsVendor}
                    />
                </Box>
                {this.renderPaymentsVendor()}
            </div>
        );
    }

}
