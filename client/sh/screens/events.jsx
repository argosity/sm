import React from 'react';
import { observer } from 'mobx-react';
import { bindAll, map } from 'lodash';
import { observable, action } from 'mobx';
import {
    List, AutoSizer, InfiniteLoader
} from 'react-virtualized';

import Screen from 'lanes/components/screen';

import Event from '../models/event';

import Query from 'lanes/models/query';

import DataList from 'lanes/components/data-list';
import Button   from 'grommet/components/Button';
import AddIcon  from 'grommet/components/icons/base/AddCircle';

import EditForm from './events/edit-form';

const Row = (props) => {
    const { row, style } = props;
    return <div data-id={row[0]} style={style}>ROW {row[1]}</div>
}

@observer
export default class Events extends React.PureComponent {

    static propTypes = {
        screen: React.PropTypes.instanceOf(Screen.Instance).isRequired,
    }

    @observable editIndex;

    constructor(props) {
        super(props);
        bindAll(this, 'row', 'getRowHeight');
    }

    query = new Query({
        src: Event,
        fields: [
            { id: 'id', visible: false },
            'code',
            'title',
        ],
    })

    @action.bound
    onEditComplete() {

    }

    getRowHeight({ index }) {
        return (this.editIndex === index) ? 300 : 40;
    }


    row(props) {
        const { index } = props;
        const Tag = (this.editIndex === index) ? EditForm : Row;
        return <Tag {...props} query={this.query} onComplete={this.onEditComplete} />;
    }

    @action.bound
    onAdd() {
        this.query.results.insertRow();
        this.editIndex = 0;
        this.listRef.recomputeRowHeights(0);
    }

    render() {
        const { query, row } = this;
        return (
            <Screen {...this.props}>
                <Button icon={<AddIcon />} onClick={this.onAdd} plain />
                <DataList
                    query={query}
                    ref={list => (this.listRef = list)}
                    rowComponent={row}
                    rowHeight={this.getRowHeight}
                />
            </Screen>
        );
    }
}
