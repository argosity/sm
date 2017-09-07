import React from 'react';
import { observer }  from 'mobx-react';
import { action } from 'mobx';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Heading from 'grommet/components/Heading';
import Button from 'grommet/components/Button';
import CloseIcon from 'grommet/components/icons/base/Close';
import AddCircleIcon from 'grommet/components/icons/base/AddCircle';
import Box from 'grommet/components/Box';
import { columnClasses } from 'hippo/lib/util';
import { Table, AutoSizer, Column } from 'react-virtualized';
import DateTime from 'hippo/components/date-time';
import Show from '../../models/show';

const ValueInput = observer(({ name, time }) => (
    <input
        value={time[name] || ''}
        onChange={({ target: { value } }) => { time[name] = value; }}
    />
));


const DateInput = observer(({ time }) => (
    <DateTime
        value={time.occurs_at}
        format="Y-m-d h:iK"
        onChange={({ target: { value } }) => { time.occurs_at = value; }}
    />
));

@observer
export default class ShowTimesEditor extends React.PureComponent {
    static propTypes = {
        show: PropTypes.instanceOf(Show).isRequired,
    }

    headerRenderer({ label }) {
        return <span>{label}</span>;
    }

    @autobind
    rowAtIndex({ index }) {
        return this.props.show.times[index];
    }

    @autobind
    renderCapacity({ rowData }) {
        return <ValueInput time={rowData} name="capacity" />;
    }

    @autobind
    renderPrice({ rowData }) {
        return <ValueInput time={rowData} name="price" />;
    }

    @autobind
    renderOccurs({ rowData }) {
        return <DateInput time={rowData} />;
    }

    @autobind
    renderControls({ rowData: occ }) {
        return (
            <Button icon={<CloseIcon />} onClick={occ.onDelete}/>
        );
    }

    @action.bound
    onAddTime() {
        this.props.show.times.unshift({});
    }

    renderHeader() {
        return (
            <Box direction="row" align="center" justify="between">
                <Heading tag='h4'>
                    Show Dates/Times
                </Heading>
                <Button icon={<AddCircleIcon />} onClick={this.onAddTime}/>
            </Box>
        );
    }

    render() {
        const { times } = this.props.show;

        if (!times || !times.length) {
            return (
                <div className={columnClasses(this.props, 'times')}>
                    {this.renderHeader()}
                </div>
            );
        }

        return (
            <div className={columnClasses(this.props, 'times')}>
                {this.renderHeader()}
                <AutoSizer>
                    {({ height, width }) =>
                        <Table
                            height={height - 50}
                            width={width}
                            rowHeight={40}
                            rowGetter={this.rowAtIndex}
                            headerHeight={40}
                            rowCount={times.length}
                        >
                            <Column
                                dataKey="occurs_at" label="Date/Time"
                                width={200} flexGrow={1} headerRenderer={this.headerRenderer}
                                cellRenderer={this.renderOccurs}
                            />
                            <Column
                                dataKey="price" label="Price"
                                width={80} headerRenderer={this.headerRenderer}
                                cellRenderer={this.renderPrice}
                            />
                            <Column
                                dataKey="capacity" label="Capacity"
                                width={80} headerRenderer={this.headerRenderer}
                                cellRenderer={this.renderCapacity}
                            />
                            <Column
                                dataKey="capacity" label=""
                                width={50} headerRenderer={this.headerRenderer}
                                cellRenderer={this.renderControls}
                            />
                        </Table>}
                </AutoSizer>
            </div>
        );
    }
}
