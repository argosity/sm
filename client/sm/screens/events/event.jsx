import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { get } from 'lodash';
import Config from 'lanes/config';

import cn from 'classnames';
import { Row, Col, getColumnProps } from 'react-flexbox-grid';
import formatDate from 'date-fns/format';

import Button   from 'grommet/components/Button';
import EditIcon  from 'grommet/components/icons/base/Edit';

function dt(date) {
    return formatDate(date, 'h:mma MMM Do YYYY');
}


function Image(props) {
    const { image, size } = props;
    const fd = get(image, `file_data.${size}`);
    if (!fd) { return null; }
    const { id: url, metadata: { height, width } } = fd;
    console.log(size, fd)
    return (
        <div className={cn(size, getColumnProps(props).className)}>
            <img
                src={`${Config.api_path}${Config.assets_path_prefix}/${url}`}
                height={height}
                width={width}
            />
        </div>
    );
}

@observer
export default class Event extends React.PureComponent {
    componentDidMount() {
        this.props.measure();
    }

    componentDidUpdate() {
        this.props.measure();
    }

    @action.bound
    onEdit() {
        this.props.onEdit(this.props.index);
    }

    render() {
        const { row, style, index: _, measure } = this.props;
        const [
            id, slug, title, sub_title, description, image, venue, occurs_at,
            visible_after, visible_until,
            onsale_after, onsale_until,
        ] = row;

        return (
            <div className="event" style={{ ...style, height: 'auto' }}>

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
                            <span className="occurs">
                                {dt(occurs_at)}
                            </span>
                            <Button icon={<EditIcon />} onClick={this.onEdit} plain />
                        </div>
                        <div className="description">
                            {description}
                        </div>
                    </Col>
                </Row>
                <Row className="dates">
                    <Col sm={6}>
                        <b>Visible:</b>
                        <div>{dt(visible_after)} ~ {dt(visible_until)}</div>
                    </Col>
                    <Col sm={6}>
                        <b>On Sale:</b>
                        <div>{dt(onsale_after)} ~ {dt(onsale_until)}</div>
                    </Col>
                </Row>
            </div>
        );
    }

}
