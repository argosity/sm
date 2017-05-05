import React from 'react';
import { observer } from 'mobx-react';
import Screen from 'lanes/components/screen';
import { Row, Col } from 'react-flexbox-grid';
import Query    from 'lanes/models/query';
import DataList from 'lanes/components/data-list';
import { autobind } from 'core-decorators';
import Heading from 'grommet/components/Heading';

import EmbedModel from '../models/embed';
import Tenant from '../models/tenant';

import './embeds/embed-styles.scss';

@observer
export default class Embeds extends React.PureComponent {

    static propTypes = {
        screen: React.PropTypes.instanceOf(Screen.Instance).isRequired,
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

    @autobind
    rowRenderer(props) {
        const { index, key } = props;
        const [
            id, tenants, name, identifier,
        ] = this.query.results.rows[index];

        return (
            <Row
                className="row"
                key={key}
            >
                <Col xs={12}><Heading tag='h3'>{name}</Heading></Col>
                <Col xs={12}>
                    <textarea
                        onFocus={this.onFocus}
                        readOnly
                        value={`<script src="${Tenant.current.url}/assets/embedded-events.js" data-render-to="#showmaker-events-listing" data-embed-id="${identifier}"></script>\n<div id="showmaker-events-listing">${Tenant.current.slug}</div>`}
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
                    rowHeight={300}
                    rowRenderer={this.rowRenderer}
                />
            </Screen>
        );
    }
}
