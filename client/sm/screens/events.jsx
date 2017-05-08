import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { bindAll } from 'lodash';
import { observable, action, computed } from 'mobx';
import {
    CellMeasurer, CellMeasurerCache,
} from 'react-virtualized';
import Query    from 'hippo/models/query';
import Screen   from 'hippo/components/screen';
import DataList from 'hippo/components/data-list';

import Button   from 'grommet/components/Button';

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

    constructor(props) {
        super(props);
        bindAll(this, 'rowRenderer');
    }

    query = new Query({
        src: EventModel,
        autoFetch: true,
        sort: { occurs_at: 'DESC' },
        syncOptions: { with: 'with_details' },
        fields: [
            { id: 'id', visible: false },
            'identifier',
            'title',
            'sub_title',
            'description',
            'image_details',
            'venue_details',
            'occurs_at',
            'visible_after', 'visible_until',
            'onsale_after', 'onsale_until',
            'capacity',
        ],
    });

    sizeCache = new CellMeasurerCache({
        fixedWidth: true,
        minHeight: 40,
    })

    @action.bound
    onEditComplete() {
        const { index, event } = this.editing;
        this.editing = {};
        this.sizeCache.clear(index, 0);
        this.listRef.recomputeRowHeights(index);
        if (event.isNew) {
            this.query.results.removeRow(index);
        }
    }

    rowRenderer(props) {
        const { index, key, parent } = props;
        const row = this.query.results.rows[index];
        const Tag = (this.editing.index === index) ? EditForm : Event;

        return (
            <CellMeasurer
                key={key}
                parent={parent}
                columnIndex={0}
                rowIndex={index}
                cache={this.sizeCache}
            >{({ measure }) =>
                <Tag
                    row={row}
                    {...props}
                    measure={measure}
                    query={this.query}
                    event={this.editing.event}
                    onEdit={this.onEditRow}
                    onComplete={this.onEditComplete}
                />
             }</CellMeasurer>
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
    onEditRow(index) {
        return this.query.results.fetchModelForRow(
            index, { include: 'image', with: '' },
        ).then((event) => {
            this.editing = { index, event };
            this.sizeCache.clear(index, 0);
            this.listRef.recomputeRowHeights(index);
        });
    }

    render() {
        return (
            <Screen {...this.props}>
                <Button icon={<AddIcon />} onClick={this.onAdd} plain />
                <DataList
                    query={this.query}
                    rowRenderer={this.rowRenderer}
                    ref={list => (this.listRef = list)}
                    rowHeight={this.sizeCache.rowHeight}
                    deferredMeasurementCache={this.sizeCache}
                    keyChange={this.listRenderKey}
                />
            </Screen>
        );
    }
}
