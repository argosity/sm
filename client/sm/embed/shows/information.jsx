import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import PageRenderer from 'hippo/components/text-editor/renderer';
import Header from 'grommet/components/Header';
import Button from 'grommet/components/Button';

import PreviousIcon from 'grommet/components/icons/base/Previous';
import ShowModel from '../../models/show';
import PurchaseButton from './purchase-button';

@observer
export default class Information extends React.Component {

    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onPurchase: PropTypes.func.isRequired,
        show: PropTypes.instanceOf(ShowModel).isRequired,
    }

    @action.bound
    onPurchase() {
        this.props.onPurchase(this.props.show);
    }

    render() {
        const { show } = this.props;
        if (!show) { return null; }

        return (
            <div className="show-information">
                <Header justify="between">
                    <Button
                        icon={<PreviousIcon />}
                        label="Listing"
                        onClick={this.props.onCancel}
                    />
                    <PurchaseButton
                        show={show}
                        label="Purchase"
                        onClick={this.onPurchase}
                    />
                </Header>
                <PageRenderer className="body" content={show.page} />
            </div>
        );
    }

}
