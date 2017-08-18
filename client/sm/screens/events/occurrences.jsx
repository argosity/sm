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
import Event from '../../models/event';

const ValueInput = observer(({ name, occurrence }) => (
    <input
        value={occurrence[name] || ''}
        onChange={({ target: { value } }) => { occurrence[name] = value; }}
    />
));


const DateInput = observer(({ occurrence }) => (
    <DateTime
        value={occurrence.occurs_at}
        format="M/D/YYYY h:mm a"
        onChange={(value) => { occurrence.occurs_at = value; }}
    />
));

@observer
export default class OccurrencesEditor extends React.PureComponent {
    static propTypes = {
        event: PropTypes.instanceOf(Event).isRequired,
    }

    headerRenderer({ label }) {
        return <span>{label}</span>;
    }

    @autobind
    rowAtIndex({ index }) {
        return this.props.event.occurrences[index];
    }

    @autobind
    renderCapacity({ rowData }) {
        return <ValueInput occurrence={rowData} name="capacity" />;
    }

    @autobind
    renderPrice({ rowData }) {
        return <ValueInput occurrence={rowData} name="price" />;
    }

    @autobind
    renderOccurs({ rowData }) {
        return <DateInput occurrence={rowData} />;
    }

    @autobind
    renderControls({ rowData: occ }) {
        return (
            <Button icon={<CloseIcon />} onClick={occ.onDelete}/>
        );
    }

    @action.bound
    onAddOccurrence() {
        this.props.event.occurrences.unshift({});
    }

    renderHeader() {
        return (
            <Box direction="row" align="center" justify="between">
                <Heading tag='h4'>
                    Occurrences
                </Heading>
                <Button icon={<AddCircleIcon />} onClick={this.onAddOccurrence}/>
            </Box>
        );
    }

    render() {
        const { occurrences } = this.props.event;

        if (!occurrences || !occurrences.length) {
            return (
                <div className={columnClasses(this.props, 'occurrences')}>
                    {this.renderHeader()}
                </div>
            );
        }

        return (
            <div className={columnClasses(this.props, 'occurrences')}>
                {this.renderHeader()}
                <AutoSizer>
                    {({ height, width }) =>
                        <Table
                            height={height - 50}
                            width={width}
                            rowHeight={40}
                            rowGetter={this.rowAtIndex}
                            headerHeight={40}
                            rowCount={occurrences.length}
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
