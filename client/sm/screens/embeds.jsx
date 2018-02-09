import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Query from 'hippo/models/query';
import Screen from 'hippo/components/screen';
import Embed from './embeds/embed';
import EmbedModel from '../models/embed';

@observer
export default class Embeds extends React.Component {

    static propTypes = {
        screen: PropTypes.instanceOf(Screen.Instance).isRequired,
    }

    query = new Query({
        src: EmbedModel,
        autoFetch: true,
        syncOptions: {
            with: ['page_details'],
        },
        sort: { name: 'DESC' },
        fields: [
            'id', 'tenants', 'name', 'identifier', 'css_values', 'page',
        ],
    });

    componentDidMount() {
        this.query.fetch();
    }

    render() {
        return (
            <Screen screen={this.props.screen}>
                {this.query.records.map(e => <Embed embed={e} key={e.id} />)}
            </Screen>
        );
    }

}
