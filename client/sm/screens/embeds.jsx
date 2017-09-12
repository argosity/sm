import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Screen from 'hippo/components/screen';
import { Row, Col } from 'react-flexbox-grid';
import Query    from 'hippo/models/query';
import DataList from 'hippo/components/data-list';
import { autobind } from 'core-decorators';
import Heading from 'grommet/components/Heading';

import EmbedModel from '../models/embed';
import './embeds/embed-styles.scss';

@observer
export default class Embeds extends React.PureComponent {

    static propTypes = {
        screen: PropTypes.instanceOf(Screen.Instance).isRequired,
    }

    query = new Query({
        src: EmbedModel,
        autoFetch: true,
        sort: { name: 'DESC' },
        fields: [
            'id', 'tenants', 'name', 'identifier',
        ],
    })

    onFocus(ev) {
        ev.target.select();
    }

    url = `${window.location.protocol}//${window.location.host}`;

    @autobind
    rowRenderer(props) {
        const { style, index, key } = props;
        const [
            _, __, name, identifier,
        ] = this.query.results.rows[index];

        return (
            <Row
                className="row"
                key={key}
                style={style}
            >
                <Col xs={12}><Heading tag='h3'>{name}</Heading></Col>
                <Col xs={12}>
                    <textarea
                        onFocus={this.onFocus}
                        readOnly
                        value={`<script src="${this.url}/assets/embedded-shows.js" data-render-to="#showmaker-shows-listing" data-embed-id="${identifier}"></script>\n<div id="showmaker-shows-listing"></div>`}
                    />
                </Col>
            </Row>
        );
    }

    render() {
        return (
            <Screen screen={this.props.screen}>
                <DataList
                    query={this.query}
                    rowHeight={200}
                    rowRenderer={this.rowRenderer}
                />
            </Screen>
        );
    }

}
