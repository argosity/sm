import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import { observable, action, computed } from 'mobx';
import {
    CellMeasurer, CellMeasurerCache,
} from 'react-virtualized';
import Query    from 'hippo/models/query';
import Screen   from 'hippo/components/screen';
import DataList from 'hippo/components/data-list';
import MasterDetail from 'hippo/components/master-detail';
import Button   from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import AddIcon  from 'grommet/components/icons/base/AddCircle';

import EventModel from '../models/event';
import Event from './events/event';
import EditForm from './events/edit-form';

import './events/events-styles.scss';

@observer
export default class Events extends React.PureComponent {
    static propTypes = {
        screen: PropTypes.instanceOf(Screen.Instance).isRequired,
    }

    @observable editing = {};

    query = new Query({
        src: EventModel,
        autoFetch: true,
        sort: { occurs_at: 'ASC' },
        syncOptions: { with: 'with_details' },
        fields: [
            { id: 'id', visible: false },
            'identifier',
            'title',
            'sub_title',
            'description',
            'image_details',
            'venue_details',
            'occurrences',
            'visible_during',
        ],
    });

    sizeCache = new CellMeasurerCache({
        fixedWidth: true,
        minHeight: 40,
        defaultWidth: '100%',
    })

    @action.bound
    onEditComplete() {
        const { index, event } = this.editing;
        if (event.isNew) {
            this.query.results.removeRow(index);
        }
        this.editing = {};
        this.sizeCache.clear(index, 0);
    }

    @autobind
    rowRenderer(props) {
        const { index, key, parent } = props;
        const row = this.query.results.rows[index];

        const renderFn = ({ measure }) => (
            <Event
                row={row}
                {...props}
                measure={measure}
                query={this.query}
                event={this.editing.event}
                onEdit={this.onEditRow}
                keyChange={this.listRenderKey}
                onComplete={this.onEditComplete}
            />
        );

        return (
            <CellMeasurer
                key={key}
                parent={parent}
                columnIndex={0}
                rowIndex={index}
                cache={this.sizeCache}
            >{renderFn}</CellMeasurer>
        );
    }

    @action.bound
    onAdd() {
        this.query.results.insertRow();
        this.editIndex = 0;
        this.sizeCache.clear(0, 0);
        this.editing = { index: 0, event: this.query.results.modelForRow(0) };
        this.listRef.recomputeRowHeights(0);
    }

    @computed get listRenderKey() {
        return `${this.query.results.updateKey}-${this.editing.index}`;
    }

    @action.bound
    onEditRow(index, event) {
        this.editing = { index, event };
        this.sizeCache.clear(index, 0);
        this.listRef.recomputeRowHeights(index);
    }

    @action.bound
    setListRef(list) {
        this.listRef = list;
    }

    renderEditingForm() {
        if (isEmpty(this.editing)) { return null; }
        const row = this.query.results.rows[this.editing.index];
        return (
            <EditForm
                row={row}
                query={this.query}
                event={this.editing.event}
                onEdit={this.onEditRow}
                onComplete={this.onEditComplete}
            />
        );
    }

    renderEventList() {
        return (
            <div className="events-list">
                <Header justify="end">
                    <Button icon={<AddIcon />} onClick={this.onAdd} plain />
                </Header>
                <DataList
                    query={this.query}
                    rowRenderer={this.rowRenderer}
                    invalidateCellSizeAfterRender={true}
                    ref={this.setListRef}
                    rowHeight={this.sizeCache.rowHeight}
                    deferredMeasurementCache={this.sizeCache}
                    keyChange={this.listRenderKey}
                />
            </div>
        );
    }

    render() {
        return (
            <Screen {...this.props}>
                <MasterDetail
                    master={this.renderEventList()}
                    detail={this.renderEditingForm()}
                />
            </Screen>
        );
    }
}
