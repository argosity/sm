import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import {
    CellMeasurer, CellMeasurerCache,
} from 'react-virtualized';
import SwipeableViews from 'react-swipeable-views';
import { CheckBox, Button } from 'grommet';
import { Add }  from 'grommet-icons';
import styled from 'styled-components';
import { Toolbar } from 'hippo/components/toolbar';
import Query    from 'hippo/models/query';
import Screen   from 'hippo/components/screen';
import DataList from 'hippo/components/data-list';
import QueryBuilder from 'hippo/components/query-builder';
import ShowModel from '../models/show';
import Show from './shows/show';
import EditFormWrapper from './shows/edit-form';
import PageEditorWrapper from './shows/page-editor';

import './shows/show-styles.scss';

const ShowsList = styled.div`
display: flex;
flex-direction: column;
height: 100vh;
.data-list {
  flex: 1;
}
`;

@observer
export default class Shows extends React.Component {

    static propTypes = {
        screen: PropTypes.instanceOf(Screen.Instance).isRequired,
    }

    @observable editing = {};

    query = new Query({
        src: ShowModel,
        autoFetch: true,
        sort: { created_at: 'desc' },
        syncOptions: {
            with: {
                with_details: true,
                visible: false,
            },
        },
        fields: [
            { id: 'id', visible: false, queryable: false },
            { id: 'identifier', queryable: false },
            'title',
            'sub_title',
            'description',
            { id: 'image_details', queryable: false },
            { id: 'venue_details', queryable: false },
            { id: 'times', queryable: false },
            'visible_during',
            { id: 'created_at', queryable: false },
        ],
    });

    sizeCache = new CellMeasurerCache({
        fixedWidth: true,
        minHeight: 40,
        defaultWidth: '100%',
    })

    // for debugging
    // componentDidMount() {
    //     when(
    //         () => this.query.rows.length,
    //         () => {
    //             this.query.results.modelForRow(1).fetch({ include: 'page' }).then((s) => {
    //                 this.onEditRow(1, s);
    //                 this.displayIndex = 2;
    //             });
    //         },
    //     );
    // }

    @action.bound
    onEditComplete() {
        const { index, show } = this.editing;
        if (show.isNew) {
            this.query.results.removeRow(index);
        }
        this.editing = {};
        this.sizeCache.clear(index, 0);
        this.displayIndex = 0;
    }

    @action.bound
    onEditPage() {
        this.displayIndex = 2;
    }

    @action.bound
    onPageEditComplete() {
        this.displayIndex = 1;
    }

    @action.bound
    onAdd() {
        const { model, index } = this.query.results.insertRow({
            index: -1, observeSave: true,
        });
        model.times.push({});
        this.onEditRow(index, model);
    }

    @computed get listRenderKey() {
        return `${this.query.results.fingerprint}-${this.editing.index}`;
    }

    @action.bound
    onEditRow(index, show) {
        this.editing = { index, show };
        this.displayIndex = 1;
        this.sizeCache.clear(index, 0);
        this.listRef.recomputeRowHeights(index);
    }

    @action.bound
    setListRef(list) {
        this.listRef = list;
    }

    @observable displayIndex = 0;

    @action.bound changeVisible(ev) {
        this.query.syncOptions.with.visible = ev.target.checked;
    }

    @autobind
    rowRenderer(props) {
        const { index, key, parent } = props;
        const row = this.query.results.rows[index];
        const renderFn = ({ measure }) => (
            <Show
                row={row}
                {...props}
                measure={measure}
                query={this.query}
                show={this.editing.show}
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

    render() {
        return (
            <Screen {...this.props}>
                <SwipeableViews
                    className="shows-wrapper"
                    disabled index={this.displayIndex}
                >
                    <ShowsList>
                        <Toolbar>
                            <QueryBuilder autoFetch={true} query={this.query} />
                            <CheckBox
                                checked={this.query.syncOptions.with.visible}
                                label="Only Visible"
                                onChange={this.changeVisible}
                            />
                            <Button icon={<Add />} onClick={this.onAdd} label="Add" />
                        </Toolbar>

                        <DataList
                            query={this.query}
                            rowRenderer={this.rowRenderer}
                            invalidateCellSizeAfterRender={true}
                            ref={this.setListRef}
                            rowHeight={this.sizeCache.rowHeight}
                            deferredMeasurementCache={this.sizeCache}
                            keyChange={this.listRenderKey}
                        />
                    </ShowsList>
                    <EditFormWrapper
                        row={this.editing.row}
                        query={this.query}
                        show={this.editing.show}
                        onEdit={this.onEditRow}
                        onEditPage={this.onEditPage}
                        onComplete={this.onEditComplete}
                    />
                    <PageEditorWrapper
                        show={2 === this.displayIndex ? this.editing.show : null}
                        onComplete={this.onPageEditComplete}
                    />
                </SwipeableViews>
            </Screen>
        );
    }

}
