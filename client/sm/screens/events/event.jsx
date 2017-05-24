import React from 'react';
import { action, observable, computed } from 'mobx';
import { observer } from 'mobx-react';
import { get } from 'lodash';
import Config from 'hippo/config';

import cn from 'classnames';
import { Row, Col, getColumnProps } from 'react-flexbox-grid';
import formatDate from 'date-fns/format';

import Button   from 'grommet/components/Button';
import EditIcon  from 'grommet/components/icons/base/Edit';
import Spinning from 'grommet/components/icons/Spinning';

function dt(date) {
    return formatDate(date, 'h:mma MMM Do YYYY');
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
export default class Event extends React.PureComponent {

    @observable isEditing = false;

    @action.bound
    onEdit() {
        this.isEditing = true;
        return this.props.query.results.fetchModelForRow(
            this.props.index, { include: 'image', with: '' },
        ).then((event) => {
            this.props.onEdit(this.props.index, event);
            this.isEditing = false;
        });
    }

    @computed get editIcon() {
        return this.isEditing ? <Spinning /> : <EditIcon />;
    }

    render() {
        const { row, style, index: _, measure } = this.props;
        const [
            id, slug, title, sub_title, description, image, venue, occurs_at,
            visible_after, visible_until,
            onsale_after, onsale_until,
        ] = row;
        return (
            <div className="event" style={{ ...style }}>

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
