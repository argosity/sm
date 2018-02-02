import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { map, partial } from 'lodash';
import styled from 'styled-components';
import { autobind } from 'core-decorators';
import { Heading, TextArea, Box } from 'grommet';
import Screen from 'hippo/components/screen';
import Query from 'hippo/models/query';
import SaveButton from 'hippo/components/save-button';
import { Form, Field } from 'hippo/components/form';
import EmbedModel from '../models/embed';

const Colors = styled.div`
display: grid;
grid-gap: 10px;
grid-template-columns: repeat(auto-fill, minmax(300px,1fr));
label {

> :first-child {
flex: 1;
}
> * {
padding: 0;
}
}
`;

const EmbedRow = styled.div`
padding: ${props => props.theme.global.edgeSize.small};
textarea {
  height: 120px;
  width: 100%;
}
`;

const onColorChange = (embed, key, { target: { value } }) => {
    embed.set_css_value(key, value);
};

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
            'id', 'tenants', 'name', 'identifier', 'css_values',
        ],
    });

    componentDidMount() {
        this.query.fetch();
    }

    onFocus(ev) {
        ev.target.select();
    }


    @autobind rowRenderer(embed) {
        return (
            <Form key={embed.identifier}>
                <EmbedRow>
                    <Heading level={3}>{embed.name}</Heading>
                    <p>Copy below HTML into a webpage to embed a listing of current shows</p>
                    <TextArea
                        onFocus={this.onFocus}
                        readOnly
                        value={embed.html}
                    />
                    <Colors>
                        {map(EmbedModel.css_value_labels, (description, key) => (
                            <Field
                                key={key}
                                name={key}
                                type="color"
                                label={description}
                                value={embed.get_css_value(key)}
                                onChange={partial(onColorChange, embed, key)}
                            />
                        ))}
                    </Colors>
                    <Box
                        direction="row"
                        align="center"
                        justify="end"
                        background="light-2"
                        margin={{ vertical: 'medium' }}
                        pad={{ horizontal: 'small', vertical: 'small', between: 'small' }}
                    >
                        <SaveButton model={embed} saveOnClick />
                    </Box>
                </EmbedRow>
            </Form>
        );
    }

    render() {
        return (
            <Screen screen={this.props.screen}>
                {map(this.query.records, this.rowRenderer)}
            </Screen>
        );
    }

}
