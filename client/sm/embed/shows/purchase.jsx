import React from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { computed, action, observable } from 'mobx';
import Heading   from 'grommet/components/Heading';
import Button    from 'grommet/components/Button';
import FormField from 'grommet/components/FormField';
import Sale from '../../models/sale';
import SaleForm from '../../components/sale/form';
import Layer from '../layer-wrapper';
import Image from './image';

@observer
export default class Purchase extends React.Component {

    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onPurchaseComplete: PropTypes.func.isRequired,
        identifier: PropTypes.string.isRequired,
        shows: MobxPropTypes.observableArray,
    }

    @observable isTokenizing = false;
    @observable _sale;
    @computed get show() {
        return this.props.shows.find(s => s.identifier === this.props.identifier);
    }

    @computed get sale() {
        if (!this.show) { return null; }
        if (!this._sale) { this._sale = new Sale({ show: this.show }); }
        return this._sale;
    }

    @action.bound
    onComplete() {
        this.props.onPurchaseComplete(this.sale);
    }

    @action.bound
    setFormRef(form) { this.form = form; }

    renderTimes() {
        if (1 === this.show.times.length) {
            return <h3>{this.show.times[0].formattedOccursAt}</h3>;
        }
        return (
            <FormField label='Show'>
                <Select
                    className="times"
                    value={
                        this.sale.time ? this.sale.time.formattedOccursAt : ''
                    }
                    onChange={this.onTimeChange}
                    options={this.timeOptions}
                />
            </FormField>
        );
    }

    render() {
        const { show, sale, props: { onCancel } } = this;
        if (!show || !sale) { return null; }

        return (
            <Layer
                className="show-purchase"
                onClose={onCancel}
                closer
            >
                <div
                    className="order-pane"
                >
                    <div className="top-info">
                        <Image image={show.image} size="thumbnail" />
                        <div className="description">
                            <Heading>{show.title}</Heading>
                            <h3 className="sub-title">{show.sub_title}</h3>
                            <p className="description">{show.description}</p>
                        </div>
                    </div>
                    <SaleForm
                        sale={sale}
                        onComplete={this.onComplete}
                        ref={this.setFormRef}

                        controls={
                            <Button label="Cancel" onClick={onCancel} accent />
                        }
                    >
                    </SaleForm>
                </div>
            </Layer>
        );
    }

}
