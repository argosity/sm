import React from 'react';
import { action, observable, computed } from 'mobx';
import { observer } from 'mobx-react';
import { get, map } from 'lodash';
import Config from 'hippo/config';

import cn from 'classnames';
import { Row, Col, getColumnProps } from 'react-flexbox-grid';
import moment from 'moment';
import DateRange from 'hippo/lib/date-range';
import Button   from 'grommet/components/Button';
import EditIcon  from 'grommet/components/icons/base/Edit';
import Spinning from 'grommet/components/icons/Spinning';

function dt(date) {
    return moment(date).format('h:mma MMM Do YYYY');
}

function Image(props) {
    const { image, size, onLoad } = props;
    const fd = get(image, `file_data.${size}`);
    if (!fd) { return null; }
    const { id: url, metadata: { height, width } } = fd;
    return (
        <div className={cn(size, getColumnProps(props).className)}>
            <img
                src={`${Config.api_path}${Config.assets_path_prefix}/${url}`}
                height={height}
                width={width}
                onLoad={onLoad}
            />
        </div>
    );
}

@observer
export default class Show extends React.PureComponent {
    @observable isEditing = false;

    @action.bound
    onEdit() {
        this.isEditing = true;
        return this.props.query.results.fetchModelForRow(
            this.props.index, { include: ['image', 'times'], with: '' },
        ).then((show) => {
            this.props.onEdit(this.props.index, show);
            this.isEditing = false;
        });
    }

    @computed get editIcon() {
        return this.isEditing ? <Spinning /> : <EditIcon />;
    }

    render() {
        const { row, style, measure } = this.props;
        const [
            _, __, title, sub_title, description, image, venue, occurances, visible_range,
        ] = row;
        const visible = new DateRange(visible_range);

        return (
            <div className="show" style={{ ...style }}>

                <Row>
                    <Col sm={3}>
                        <Image size="medium" image={image} onLoad={measure} />
                    </Col>
                    <Col className="info" sm={9}>
                        <div className="title">
                            <Image size="thumbnail" image={venue ? venue.logo : {}} />
                            <div className="center">
                                <h2>{title}</h2>
                                <h3>{sub_title}</h3>
                            </div>
                            <Button
                                icon={this.editIcon}
                                onClick={this.onEdit} plain
                            />
                        </div>
                        <div className="description">
                            {description}
                        </div>
                    </Col>
                </Row>
                <Row className="dates">
                    <Col sm={6}>
                        <b>Visible:</b>
                        <div>{dt(visible.start)} ~ {dt(visible.end)}</div>
                    </Col>
                    <Col sm={6} className="occurs">
                        <b>Occurs:</b>
                        <ul>{map(occurances, o => <li key={o.id}>{dt(o.occurs_at)}</li>)}</ul>
                    </Col>

                </Row>
            </div>
        );
    }
}
