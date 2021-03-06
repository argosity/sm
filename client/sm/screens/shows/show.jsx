import React from 'react';
import { action, observable, computed } from 'mobx';
import { observer } from 'mobx-react';
import { get, map } from 'lodash';
import Config from 'hippo/config';
import cn from 'classnames';
import styled from 'styled-components';
import { Row, Col, getColumnProps } from 'react-flexbox-grid';
import moment from 'moment';
import { Button }   from 'grommet';
import { Edit, View }  from 'grommet-icons';
import Spinning from 'hippo/components/icon/spinning';
import DateRange from 'hippo/lib/date-range';

function dt(date) {
    return moment(date).format('h:mma MMM Do YYYY');
}


const ShowWrapper = styled.div`
flex: 1;
padding: 1rem;
min-height: 120px;
border-bottom: 1px solid lightgrey;
box-sizing: border-box;

.medium img {
    max-height: 200px;
    max-width: 100%;
    width: auto;
    height: auto;
}
.thumbnail img {
    max-height: 80px;
    max-width: 80px;
}
.title {
    display: flex;
    align-items: flex-start;
    flex: 1;
    h2, h3 {
        margin-bottom: inherit;
    }
    .center {
        flex: 1;
    }
}
.dates .visible {
    display: flex;
    svg {
        margin-left: 0.5rem;
    }
}`;

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
export default class Show extends React.Component {

    @observable isEditing = false;

    @action.bound
    onEdit() {
        this.isEditing = true;
        return this.props.query.results.fetchModelForRow(
            this.props.index, { include: ['image', 'times', 'page'], with: '' },
        ).then((show) => {
            this.props.onEdit(this.props.index, show);
            this.isEditing = false;
        });
    }

    @computed get editIcon() {
        return this.isEditing ? <Spinning /> : <Edit />;
    }

    visibleIcon(visible) {
        if (!visible.isCurrent) { return null; }
        return (
            <View size="small" type="status" />
        );
    }

    render() {
        const { row, style, measure } = this.props;
        const [
            _, __, title, sub_title, description, image, venue, occurances, visible_range,
        ] = row;
        const visible = new DateRange(visible_range);

        return (
            <ShowWrapper className="show" style={{ ...style }}>
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
                        <b className="visible">
                            Visible:
                            {this.visibleIcon(visible)}
                        </b>
                        <div>{dt(visible.start)} ~ {dt(visible.end)}</div>
                    </Col>
                    <Col sm={6} className="occurs">
                        <b>Occurs:</b>
                        <ul>{map(occurances, o => <li key={o.id || 'new'}>{dt(o.occurs_at)}</li>)}</ul>
                    </Col>

                </Row>
            </ShowWrapper>
        );
    }

}
