import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { map } from 'lodash';
import styled from 'styled-components';
import Screen from 'hippo/components/screen';
import Query from 'hippo/models/query';
import { autobind } from 'core-decorators';
import { Heading, TextArea } from 'grommet';
import EmbedModel from '../models/embed';
import './embeds/embed-styles.scss';

const Row = styled.div`
padding: ${props => props.theme.global.edgeSize.small};
textarea {
  height: 150px;
  width: 100%;
}
`;

@observer
export default class Embeds extends React.Component {

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
    });

    componentDidMount() {
        this.query.fetch();
    }

    onFocus(ev) {
        ev.target.select();
    }

    url = `${window.location.protocol}//${window.location.host}`;

    @autobind
    rowRenderer(row, index) {
        const [
            _, __, name, identifier,
        ] = row;
        return (
            <Row key={index}>
                <Heading level={3}>{name}</Heading>
                <TextArea
                    onFocus={this.onFocus}
                    readOnly
                    value={`<script src="${this.url}/assets/embedded-shows.js" data-render-to="#showmaker-shows-listing" data-embed-id="${identifier}"></script>\n<div id="showmaker-shows-listing"></div>`}
                />
            </Row>
        );
    }

    render() {
        return (
            <Screen screen={this.props.screen}>
                {map(this.query.rows, this.rowRenderer)}
            </Screen>
        );
    }

}
